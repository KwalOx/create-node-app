import chalk from "chalk";
import fs from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";
import execa from "execa"
import Listr from 'listr'
import { projectInstall } from "pkg-install";

const access = promisify(fs.access)
const copy = promisify(ncp)
const fsPromises = fs.promises;

async function copyTemplateFiles(options) {
	return copy(options.templateDirectory, options.targetDirectory, {
		clobber: false
	})
}

async function renamePackageJson(options) {
	try {
		const file = await fsPromises.readFile(path.join(options.targetDirectory, "package.json"), "utf8");

		const newFile = file.replaceAll("<project-name>", options.projectName)

		await fsPromises.writeFile(path.join(options.targetDirectory, "package.json"), newFile, "utf8")
	  } catch (err) {
		console.error('%s Failed to replace project name in Package.json', chalk.red.bold("ERROR"));
		console.error(err)
	  }
}

async function renameDockerCompose(options) {
	try {
		const fileDev = await fsPromises.readFile(path.join(options.targetDirectory, "docker-compose.yaml"), "utf8");
		const newFileDev = fileDev.replaceAll("<project-name>", options.projectName)
		await fsPromises.writeFile(path.join(options.targetDirectory, "docker-compose.yaml"), newFileDev, "utf8")


		const fileProd = await fsPromises.readFile(path.join(options.targetDirectory, "production.yaml"), "utf8");
		const newFileProd = fileProd.replaceAll("<project-name>", options.projectName)
		await fsPromises.writeFile(path.join(options.targetDirectory, "production.yaml"), newFileProd, "utf8")
	  } catch (err) {
		console.error('%s Failed to replace project name in production.yaml', chalk.red.bold("ERROR"));
		console.error(err)
	  }
}

async function initGit(options) {
	const result = await execa("git", ["init"], {
		cwd: options.targetDirectory
	})

	if (result.failed) {
		return Promise.reject(new Error("Fialed to initialize Git"))
	}

	return 
}

export async function createProject(options) {
	options = {
		...options,
		targetDirectory: options.targetDirectory || process.cwd()
	}

	const currentFileUrl = import.meta.url
	const templateDir = path.resolve(
		new URL(currentFileUrl).pathname.substring(new URL(currentFileUrl).pathname.indexOf('/')+1),
		'../../templates',
		options.template.toLowerCase()
	);

	options.templateDirectory = templateDir
		
	try {
		await access(templateDir, fs.constants.R_OK)
	} catch (err) {
		console.log(err)
		console.error("%s Invalid template name", chalk.red.bold("ERROR"))
		process.exit(1)
	}

	console.log("Copying project files")


	const tasks = new Listr([
		{
			title: "Copy project files",
			task: () => copyTemplateFiles(options)
		},
		{
			title: "Setting up package.json",
			task: () => renamePackageJson(options)
		},
		{
			title: "Setting up docker-compose files",
			task: () => renameDockerCompose(options)
		},
		{
			title: "Initialize git",
			task: () => initGit(options),
			enabled: () => options.git
		},
		{
			title: "Install dependencies",
			task: () => projectInstall({
				cwd: options.targetDirectory
			}),
			skip: () => !options.runInstall
				? 'Pass --install to automatically install dependencies'
				: undefined,
		}
	])

	await tasks.run()
	
	console.log("%s Project ready", chalk.green.bold("DONE"))
	return true
} 
