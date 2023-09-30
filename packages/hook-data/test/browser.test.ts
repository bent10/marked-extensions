/// <reference types="vitest/globals" />

import markedHookData from '../src/index.js'
import * as utils from '../src/utils.js'

it('should ignore data loading in the browser', () => {
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const utilsMock = vi.spyOn(utils, 'isBrowser').mockImplementation(() => true)

  const markdownHook = markedHookData('./test/fixtures/*.json')
  const data = {}
  const result = markdownHook('foo', data, false)

  expect(result).toEqual('foo')
  expect(data).toEqual({})

  warnSpy.mockRestore()
  utilsMock.mockRestore()
})
