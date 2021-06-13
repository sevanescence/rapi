const { execFile } = require('child_process');
const express = require('express');
const path = require('path');
const app = express();

if (process.argv.length < 4) {
    console.error('Too few arguments provided. Usage: node src/server [port: number] [Rscript path: string]');
    process.exit(1);
}

const args = {
    rscript_path: decodeURIComponent(process.argv[3]),
    port: parseInt(process.argv[2]),
};

console.log('\x1b[33m\x1b[1mResolving Rscript path...\x1b[0m');
const rscriptTest = execFile(args.rscript_path, ['--version'], { cwd: __dirname });

let error;
rscriptTest.on('error', (err) => {
    error = err;
});

const RscriptMeta = {
    version: '',
    date: '',
};
// for some reason, Rscript --version is written to stderr.
// dont worry, i know for a fact this will report the
// Rscript version ... i think
rscriptTest.stderr.once('data', (chunk) => {
    // rewrite this bereft regex
    RscriptMeta.version = chunk.match(/\d+?\.\d+?\.\d+?\b/g)[0];
    RscriptMeta.date = chunk.match(/\d{4}-\d{2}-\d{2}/g)[0];
});

rscriptTest.on('close', (code, sig) => {
    if (error) {
        if (error.code === 'ENOENT') {
            console.error(`\x1b[31m\x1b[1mError: Rscript not found at path ${args.rscript_path}\x1b[0m`);
        } else {
            console.error('\x1b[31m\x1b[1mUnknown/unreported error.\x1b[0m');
        }
        process.exit(1);
    }
    console.log('\x1b[32m\x1b[1mRscript directory resolved!\x1b[0m');
    console.log(`\x1b[32mRscript version: \x1b[0m${RscriptMeta.version} ${RscriptMeta.date} \x1b[0m`);
    const updates = execFile(args.rscript_path, ['../resources/updates.r'], { cwd: __dirname });
    updates.on('exit', (code) => {
        if (code == 0) {
            console.log('\x1b[32mRscript is up to date!\x1b[0m');
        } else if (code == 2) {
            console.log('Rscript can be updated. Consider updating: https://cran.r-project.org/');
        } else if (code == 1) {
            console.warn('\x1b[31mSomething went wrong checking Rscript version. Maybe file read permissions?\x1b[0m');
        }
    });

    app.listen(args.port, () => {
        console.log(`listening on port ${args.port}`);
    });
});
