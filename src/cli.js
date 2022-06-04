import arg from "arg"
import chalk from "chalk";
import inquirer from "inquirer";
import path from "path";
import { createProject } from "./main"
import validateProjectName  from "validate-npm-package-name"

function parseArguments(rawArgs) {
	const args = arg({
		"--git": Boolean,
		"--skip": Boolean,
		"--install": Boolean,
		"--g": "--git",
		"--y": "--skip",
		"--i": "--install",
	}, {
		argv: rawArgs.slice(2)
	})

	let projectName = args._[0]
	if (projectName === undefined) {
		console.log("%s Missing project name.", chalk.red.bold("ERROR"))
		console.log("Run \"create-node-app %s\"", chalk.blue.bold("<project-name>"))
		process.exit(1)
	}

	if (projectName === ".") {
		projectName = path.basename(path.resolve(process.cwd()))
		console.log("Using current folder name as project name: %s", chalk.blue.bold(projectName))
	}

	if (!validateProjectName(projectName).validForNewPackages) {
		console.log("%s Invalid project name.", chalk.red.bold("ERROR"))
		process.exit(1)
	}

	return {
		projectName: projectName,
		template: undefined,
		skipPrompts: args['--skip'] || false,
		git: args['--git'] || false,
		runInstall: args['--install'] || false,
	}
}

async function promptForMissingOptions(options) {
	const defaultTemplate = "JavaScript";
	if (options.skipPrompts) {
		return {
			...options,
			template: options.template || defaultTemplate
		}
	}

	const questions = [];
	if (!options.template) {
		questions.push({
			type: process.stdout.isTTY ? "list" : "rawlist",
			name: "template",
			message: "Please choose which template to use.",
			choices: ["JavaScript", "TypeScript", "TypeScript Express"],
			default: defaultTemplate
		})
	}

	if (!options.git) {
		questions.push({
			type: "confirm",
			name: "git",
			message: "Initialize a git repository?",
			default: false
		})
	}

	const answers = await inquirer.prompt(questions);
	return {
		...options,
		template: options.template || answers.template,
		git: options.git || answers.git,
	}
}

export async function cli(args) {
	let options = parseArguments(args)
	options = await promptForMissingOptions(options)
	await createProject(options)

}
