import React from 'react'
import _ from 'lodash'

import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ZoomSlideBar from '../src'

Enzyme.configure({ adapter: new Adapter() })

test('Initialise ZoomSlideBar state after mount', () => {
  const low = 0
  const high = 100
  const max = 100
  const min = 0
  const step = 1
  const mockFn = jest.fn()

  const slideBar = Enzyme.shallow(
    <ZoomSlideBar
      Low={low}
      High={high}
      Max={max}
      Min={min}
      onChangeLow={mockFn}
      onChangeHigh={mockFn}
      onChangePos={mockFn} />
  )

  // Low pos object
  expect(slideBar.state('LowPos').Value).toBe(low)
  expect(slideBar.state('LowPos').Label).toBe(`${low}`)
  // expect(slideBar.state('LowPos').Percentage).toBe(0)

  // High pos object
  expect(slideBar.state('HighPos').Value).toBe(high)
  expect(slideBar.state('HighPos').Label).toBe(`${high}`)
  // expect(slideBar.state('HighPos').Percentage).toBe(1)

  // Other state parameters
  const stepRange = _.range(min, max + step, step)

  expect(slideBar.state('dragging')).toBe(null)
  expect(slideBar.state('Steps').length).toBe(stepRange.length)
  expect(slideBar.state('dragOffset')).toBe(0)
  expect(slideBar.state('startPos')).toBe(0)
  expect(slideBar.state('eventType')).toBe(null)
})
