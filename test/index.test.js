import React from 'react'
import _ from 'lodash'

import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ZoomSlideBar from '../src'

Enzyme.configure({ adapter: new Adapter() })

describe('A ZoomSlideBar with only required props should', () => {
  const low = 0
  const high = 100
  const max = 100
  const min = 0
  const step = 1

  let slideBar
  let onChangeLow
  let onChangeHigh
  let onChangePos
  let rootDiv

  beforeEach(() => {
    onChangeLow = jest.fn()
    onChangeHigh = jest.fn()
    onChangePos = jest.fn()

    rootDiv = document.createElement('div')
    rootDiv.id = 'react-root'
    rootDiv.style.width = '800px'
    document.body.appendChild(rootDiv)

    slideBar = Enzyme.mount(
      <ZoomSlideBar
        Low={low}
        High={high}
        Max={max}
        Min={min}
        onChangeLow={onChangeLow}
        onChangeHigh={onChangeHigh}
        onChangePos={onChangePos} />,
        { attachTo: rootDiv }
    )
  })

  afterEach(() => {
    rootDiv.remove()
  })

  it('matches snapshot', () => {
    expect(slideBar).toMatchSnapshot()
  })

  it('requires all necessary props', () => {
    expect(slideBar.props().Low).toBeDefined()
    expect(slideBar.props().High).toBeDefined()
    expect(slideBar.props().Max).toBeDefined()
    expect(slideBar.props().Min).toBeDefined()
    expect(slideBar.props().onChangeLow).toBeDefined()
    expect(slideBar.props().onChangeHigh).toBeDefined()
    expect(slideBar.props().onChangePos).toBeDefined()
  })

  it('renders slider, low position drag block and high position drag block', () => {
    expect(slideBar.instance().slider).toBeDefined()
    expect(slideBar.instance().Low).toBeDefined()
    expect(slideBar.instance().High).toBeDefined()
  })

  it('correctly initialises all undefined prop values', () => {
    expect(slideBar.props().Step).toBe(1)
    expect(slideBar.props().Decimal).toBe(0)
    expect(slideBar.props().BackUnit).toBe('')
    expect(slideBar.props().Vertical).toBe(false)
    expect(slideBar.props().DisplayLabel).toBe(false)
  })

  it('correctly initialises ZoomSlideBar state after mount', () => {
    // Low pos object
    expect(slideBar.state('LowPos').Value).toBe(low)
    expect(slideBar.state('LowPos').Label).toBe(`${low}`)
    expect(slideBar.state('LowPos').Position).toBe(0)
    expect(slideBar.state('LowPos').Percentage).toBe(0)

    // High pos object
    expect(slideBar.state('HighPos').Value).toBe(high)
    expect(slideBar.state('HighPos').Label).toBe(`${high}`)
    expect(slideBar.state('HighPos').Position).toBe(800)
    expect(slideBar.state('HighPos').Percentage).toBe(1)

    // Other state parameters
    const stepRange = _.range(min, max + step, step)

    expect(slideBar.state('dragging')).toBe(null)
    expect(slideBar.state('Step')).toBe(1)
    expect(slideBar.state('Steps').length).toBe(stepRange.length)
    expect(slideBar.state('StepLength')).toBe(8)
    expect(slideBar.state('dragOffset')).toBe(0)
    expect(slideBar.state('startPos')).toBe(0)
    expect(slideBar.state('eventType')).toBe(null)
  })
})
