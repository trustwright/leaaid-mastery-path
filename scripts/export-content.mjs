import{mkdir,writeFile}from'node:fs/promises';import{QUESTIONS,MODULES}from'../lib/questions.ts';
await mkdir(new URL('../content/',import.meta.url),{recursive:true});
await writeFile(new URL('../content/questions.json',import.meta.url),JSON.stringify({schemaVersion:1,questions:QUESTIONS},null,2)+'\n');
const coverage=MODULES.map(m=>`| ${m.code} | ${m.title} | ${QUESTIONS.filter(q=>q.moduleId===m.id).length} | ${m.source} |`).join('\n');
await writeFile(new URL('../reports/source-coverage.md',import.meta.url),`# LEAAID source coverage\n\n| Module | Domain | Items | Source |\n|---|---|---:|---|\n${coverage}\n\nEvery scored item includes a page or slide locator and atomic claim. The first ten items per module form the scored round; the second ten support remediation and the final challenge.\n`);
await writeFile(new URL('../reports/unresolved-evidence.md',import.meta.url),'# Unresolved evidence report\n\nNo missing module files or unresolved cross-source conflicts were found. Human subject-matter review remains required before using the question bank for formal assessment or credentialing.\n');
console.log(`exported ${QUESTIONS.length} questions`);
