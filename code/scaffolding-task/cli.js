#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const ejs = require('ejs')

inquirer
    .prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Project name?'
        }, {
            type: 'list',
            name: 'automation',
            message: 'What automation tool?',
            choices: ['Gulp', 'Grunt'],
            default: 'Gulp'
        }, {
            type: 'list',
            name: 'framework',
            message: 'What framework?',
            choices: ['React', 'Vue', 'Angular'],
            default: 'React'
        }
    ])
    .then(anwsers => {
        const tmplDir = path.join(__dirname, 'templates')
        const destDir = process.cwd()

        fs.readdir(tmplDir, (err, files) => {
            if (err) throw err
            files.forEach(file => {
                if (file == anwsers['automation'].toLowerCase() + 'file.js' || file == anwsers['framework'].toLowerCase() + '.js') {
                    ejs.renderFile(path.join(tmplDir, file), anwsers, (err, result) => {
                        if (err) throw err
                        fs.writeFileSync(path.join(destDir, file), result)
                    })
                }
            })
        })
    })