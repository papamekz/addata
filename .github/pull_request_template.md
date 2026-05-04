## Summary

- What claim, metadata, script, or documentation change does this PR make?

## Evidence Quality

- [ ] Source is independent of the advertising industry, or explicitly marked as source critique / operator self-report
- [ ] Source URL is reachable
- [ ] Claim is not a duplicate of an existing record
- [ ] Impact score and impact types follow `DATA_QUALITY.md`
- [ ] For legal, medical, financial, or policy claims: primary source checked where available

## Checks

- [ ] `node scripts/audit-data.js`
- [ ] `node scripts/audit-urls.js` if source URLs changed
- [ ] `node scripts/build-data.js` if data changed
