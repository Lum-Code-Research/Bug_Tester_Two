#!/usr/bin/env node
const reportName = process.argv[2] ?? "summary";
console.log(JSON.stringify({ report: reportName, generatedAt: new Date().toISOString() }));
