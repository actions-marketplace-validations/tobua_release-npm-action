import { join } from 'path'
import { execSync } from 'child_process'

test('Release request in debug mode works without issues.', () => {
  process.env['INPUT_NPM_TOKEN'] = 'debug'
  process.env['INPUT_DRY_RUN'] = 'true'

  try {
    execSync(`node ${join(process.cwd(), 'index.js')}`, { env: process.env }).toString()
  } catch (error) {
    const output = error.stdout.toString()
    // Debug mode triggered by NPM_TOKEN=debug
    expect(output).toContain('Release requested through debug mode.')
    // Will not publish in debug mode.
    expect(output).toContain('Skipping release in debug mode.')
  }
})
