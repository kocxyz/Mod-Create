#!/usr/bin/env node

import fse from 'fs-extra';
import path from 'path';
import { prompt } from 'enquirer';
import { renderFile } from 'template-file';

async function main() {
  const response = await prompt<{ name: string; description: string; author: string }>([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the mod?',
    },
    {
      type: 'input',
      name: 'description',
      message: 'How would you describe the mod?',
    },
    {
      type: 'input',
      name: 'author',
      message: 'What is the name of the author?',
    },
    {
      type: 'select',
      name: 'type',
      message: 'Which type of mod do you want to create?',
      choices: ['server-client', 'server-only'],
    },
  ]);

  response.name = response.name.toLocaleLowerCase().replaceAll(' ', '-');
  const dir = response.name;
  const templateDir = path.join(__dirname, '../template');

  fse.copySync(path.join(templateDir, 'source'), dir);
  fse.writeFileSync(
    path.join(dir, 'package.json'),
    await renderFile(path.join(templateDir, 'package.json.template'), response)
  );

  fse.writeFileSync(
    path.join(dir, 'manifest.yaml'),
    await renderFile(path.join(templateDir, 'manifest.yaml.template'), response)
  );
}

main();
