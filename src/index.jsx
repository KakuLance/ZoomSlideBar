import React, { Component } from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'

import {
  Root,
  Bar,
  Label,
  Dot,
  PosBar
} from './style'

class ZoomSlideBar extends Component {
  constructor(props) {
    super(props)

    const {
      Max,
      Min,
      Low,
      High
    } = props

    this.state = {
      LowPos: {
        Label: `${Low}`,
        Value: Low,
        Percentage: (Low - Min) / (Max - Min)
      },
      HighPos: {
        Label: `${High}`,
        Value: High,
        Percentage: (High - Min) / (Max - Min)
      },
      dragging: null,
      Steps: [],
      StepLength: 0,
      dragOffset: 0,
      startPos: 0,
      eventType: null
    }

    this.addCommas = this.addCommas.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
    this.handleDragPosBar = this.handleDragPosBar.bind(this)
    this.handleStartDragging = this.handleStartDragging.bind(this)
    this.handleStartDraggingPosBar = this.handleStartDraggingPosBar.bind(this)
    this.handleEndDragging = this.handleEndDragging.bind(this)
    this.handleEndDraggingPosBar = this.handleEndDraggingPosBar.bind(this)
    this.pauseEvent = this.pauseEvent.bind(this)
    this.calculateSteps = this.calculateSteps.bind(this)
  }

  componentDidMount() {
    this.calculateSteps()
  }

  componentWillReceiveProps(newProps) {
    if (!this.state.dragging &&
        (this.props.Low !== newProps.Low ||
         this.props.High !== newProps.High)) {
      return this.setState({
        LowPos: this.state.Steps.filter((step) => {
          return Math.abs(step.Value - newProps.Low) <= newProps.Step / 2
        })[0],
        HighPos: this.state.Steps.filter((step) => {
          return Math.abs(step.Value - newProps.High) <= newProps.Step / 2
        })[0]
      })
    }
  }

  addCommas(num) {
    if (typeof num === 'string' || typeof num === 'number') {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return num
  }

  handleDrag(e) {
    const {
      Decimal,
      Vertical,
      onChangeLow,
      onChangeHigh
    } = this.props

    const {
      dragging,
      LowPos,
      HighPos,
      dragOffset,
      Steps,
      Step,
      StepLength,
      eventType
    } = this.state

    this.pauseEvent(e)

    const startKey = Vertical ? 'top' : 'left'
    const clickKey = Vertical ? 'clientY' : 'clientX'

    const slider = this.refs.slider
    const sliderStart = slider.getBoundingClientRect()[startKey]

    const mousePos = eventType === 'mouse' ? e[clickKey] : e.touches[0][clickKey]

    if (!dragging || (mousePos === 0 && sliderStart > 0)) return false

    const newPos = mousePos - dragOffset

    let newPosStep

    if (newPos < Steps[0].Position) {
      newPosStep = Steps[0]
    } else if (newPos > Steps[Steps.length - 1].Position) {
      newPosStep = Steps[Steps.length - 1]
    } else {
      newPosStep = Steps.filter((step) => {
        return Math.abs(step.Position - newPos) <= StepLength / 2
      })[0]
    }

    if (typeof newPosStep === 'undefined') return false

    if (dragging === 'Low') {
      return this.setState({
        LowPos: (newPosStep.Percentage >= HighPos.Percentage) ?
          _.find(Steps, { Label: (HighPos.Value - Step).toFixed(Decimal)}) :
          newPosStep
      }, () => {
        // The second parameter indicates the dragging is not ended yet
        return onChangeLow(LowPos.Value, false)
      })
    }

    return this.setState({
      HighPos: (newPosStep.Percentage <= LowPos.Percentage) ?
        _.find(Steps, { Label: (LowPos.Value + Step).toFixed(Decimal)}) :
        newPosStep
    }, () => {
      // The second parameter indicates the dragging is not ended yet
      return onChangeHigh(HighPos.Value, false)
    })
  }

  handleDragPosBar(e) {
    const {
      Vertical,
      onChangePos
    } = this.props

    const {
      dragging,
      LowPos,
      HighPos,
      startPos,
      Steps,
      StepLength,
      eventType
    } = this.state

    this.pauseEvent(e)

    const startKey = Vertical ? 'top' : 'left'
    const clickKey = Vertical ? 'clientY' : 'clientX'

    const slider = this.refs.slider
    const sliderStart = slider.getBoundingClientRect()[startKey]

    const mousePos = eventType === 'mouse' ? e[clickKey] : e.touches[0][clickKey]

    if (!dragging || (mousePos === 0 && sliderStart > 0)) return false

    const posOffset = mousePos - startPos

    const lowPosOffset = (LowPos.Position + posOffset <= Steps[0].Position) ?
       Steps[0].Position - LowPos.Position :
       posOffset
    const highPosOffset = (HighPos.Position + posOffset >= Steps[Steps.length - 1].Position) ?
       Steps[Steps.length - 1].Position - HighPos.Position :
       posOffset

    const actualPosOffset = (Math.abs(lowPosOffset) < Math.abs(highPosOffset)) ?
      lowPosOffset :
      highPosOffset

    const newLowPosStep = Steps.filter((step) => {
      return Math.abs(step.Position - (LowPos.Position + actualPosOffset)) <= StepLength / 2
    })[0]

    const newHighPosStep = Steps.filter((step) => {
      return Math.abs(step.Position - (HighPos.Position + actualPosOffset)) <= StepLength / 2
    })[0]

    if (typeof newLowPosStep === 'undefined' ||
        typeof newHighPosStep === 'undefined') return false

    return this.setState({
      LowPos: newLowPosStep,
      HighPos: newHighPosStep,
      startPos: mousePos
    }, () => {
      // The second parameter indicates the dragging is not ended yet
      return onChangePos(LowPos.Value, HighPos.Value, false)
    })
  }

  handleStartDragging(e, posKey, eventType) {
    document.addEventListener((eventType === 'mouse') ?
      'mousemove' :
      'touchmove', this.handleDrag)

    document.addEventListener((eventType === 'mouse') ?
      'mouseup' :
      'touchend', this.handleEndDragging)

    this.pauseEvent(e)

    const { Vertical } = this.props
    const { Steps, Step } = this.state

    const currentValue = this.state[`${posKey}Pos`].Value

    let startPos

    if (currentValue < Steps[0].Value) {
      startPos = Steps[0]
    } else if (currentValue > Steps[Steps.length - 1].Value) {
      startPos = Steps[Steps.length - 1]
    } else {
      startPos = Steps.filter((step) => {
        return Math.abs(step.Value - currentValue) <= Step / 2
      })[0]
    }

    const clickKey = Vertical ? 'clientY' : 'clientX'
    const currentPos = startPos.Position
    const mousePos = (eventType === 'mouse') ? e[clickKey] : e.touches[0][clickKey]

    return this.setState({
      dragging: posKey,
      dragOffset: mousePos - currentPos,
      eventType
    })
  }

  handleStartDraggingPosBar(e, eventType) {
    document.addEventListener((eventType === 'mouse') ?
      'mousemove' :
      'touchmove', this.handleDragPosBar)

    document.addEventListener((eventType === 'mouse') ?
      'mouseup' :
      'touchend', this.handleEndDraggingPosBar)

    this.pauseEvent(e)

    const { Vertical } = this.props

    const clickKey = Vertical ? 'clientY' : 'clientX'
    const mousePos = (eventType === 'mouse') ? e[clickKey] : e.touches[0][clickKey]

    return this.setState({
      dragging: 'PosBar',
      startPos: mousePos,
      eventType
    })
  }

  handleEndDragging() {
    const { onChangeHigh, onChangeLow } = this.props
    const {
      dragging,
      LowPos,
      HighPos,
      eventType
    } = this.state

    document.removeEventListener((eventType === 'mouse') ?
      'mousemove' :
      'touchmove', this.handleDrag)

    document.removeEventListener((eventType === 'mouse') ?
      'mouseup' :
      'touchend', this.handleEndDragging)

    if (dragging === 'Low') onChangeLow(LowPos.Value, true)
    if (dragging === 'High') onChangeHigh(HighPos.Value, true)

    return this.setState({
      dragging: null,
      eventType: null
    })
  }

  handleEndDraggingPosBar() {
    const { onChangePos } = this.props
    const {
      LowPos,
      HighPos,
      eventType
    } = this.state

    document.removeEventListener((eventType === 'mouse') ?
      'mousemove' :
      'touchmove', this.handleDragPosBar)

    document.removeEventListener((eventType === 'mouse') ?
      'mouseup' :
      'touchend', this.handleEndDraggingPosBar)

    onChangePos(LowPos.Value, HighPos.Value, true)

    return this.setState({
      dragging: null,
      startPos: 0,
      eventType: null
    })
  }

  pauseEvent(e) {
    e.stopPropagation()
    e.preventDefault()
  }

  calculateSteps() {
    const {
      Max,
      Min,
      Decimal,
      Step,
      Vertical
    } = this.props

    const { LowPos, HighPos } = this.state

    const startKey = Vertical ? 'top' : 'left'
    const rangeKey = Vertical ? 'offsetHeight' : 'offsetWidth'

    const slider = this.refs.slider
    const sliderLength = !slider ? 0 : slider[rangeKey]
    const sliderStart = !slider ? 0 : slider.getBoundingClientRect()[startKey]

    const SliderStep = (typeof Step === 'undefined') ? Math.pow(10, (-1 * Decimal)) : Step
    const StepLength = SliderStep / (Max - Min) * sliderLength

    const Steps = _.map(_.range(Min, Max + SliderStep, SliderStep), (num) => {
      const label = num.toFixed(Decimal)
      const Position = ((num - Min) / (Max - Min)) * sliderLength + sliderStart

      return {
        Label: label,
        Value: +(label),
        Position,
        Percentage: (Position - sliderStart) / sliderLength
      }
    })

    return this.setState({
      LowPos: Steps.filter((step) => {
        return Math.abs(step.Value - LowPos.Value) <= Step / 2
      })[0],
      HighPos: Steps.filter((step) => {
        return Math.abs(step.Value - HighPos.Value) <= Step / 2
      })[0],
      Steps,
      Step: SliderStep,
      StepLength
    })
  }

  renderDot(posKey) {
    const {
      BackUnit,
      DisplayLabel,
      Vertical
    } = this.props

    const position = this.state[`${posKey}Pos`]
    const { Percentage } = position
    const label = position.Label

    const styleKeys = Vertical ? {
      Low: 'bottom',
      High: 'top'
    } : {
      Low: 'right',
      High: 'left'
    }

    const posPercent = (posKey === 'Low') ?
      100 - Percentage * 100 :
      Percentage * 100

    const styleKey = styleKeys[posKey]

    return (
      <div>

        { !DisplayLabel ? null : (
          <Label
            posStyle={`${styleKey}: ${posPercent}%;`}>
            {`${this.addCommas(label)}${BackUnit || ''}`}
          </Label>
        ) }

        <Dot
          innerRef={(comp) => this.refs[posKey] = comp}
          onMouseDown={(e) => this.handleStartDragging(e, posKey, 'mouse')}
          onTouchStart={(e) => this.handleStartDragging(e, posKey, 'touch')}
          vertical={Vertical}
          posStyle={`${styleKey}: ${posPercent}%;`} />

      </div>
    )
  }

  renderPosBar() {
    const { Vertical } = this.props
    const { HighPos, LowPos } = this.state

    const lowPosKey = Vertical ? 'top' : 'left'
    const highPosKey = Vertical ? 'bottom' : 'right'

    const lowPos = LowPos.Percentage * 100
    const highPos = 100 - HighPos.Percentage * 100

    return (
      <PosBar
        innerRef={(comp) => this.refs.PosBar = comp}
        onMouseDown={(e) => this.handleStartDraggingPosBar(e, 'mouse')}
        onTouchStart={(e) => this.handleStartDraggingPosBar(e, 'touch')}
        vertical={Vertical}
        posStyle={`
          ${lowPosKey}: ${lowPos}%;
          ${highPosKey}: ${highPos}%;
        `} />
    )
  }

  render() {
    return (
      <Root>

        <Bar
          innerRef={(comp) => this.refs.slider = comp}
          vertical={this.props.Vertical}>
          {this.renderDot('Low')}

          {this.renderPosBar()}

          {this.renderDot('High')}
        </Bar>

      </Root>
    )
  }
}

ZoomSlideBar.propTypes = {
  Low: PropTypes.number.isRequired,
  High: PropTypes.number.isRequired,
  Max: PropTypes.number.isRequired,
  Min: PropTypes.number.isRequired,
  Step: PropTypes.number,
  Decimal: PropTypes.number,
  BackUnit: PropTypes.string,
  Vertical: PropTypes.bool,
  DisplayLabel: PropTypes.bool,
  onChangeLow: PropTypes.func.isRequired,
  onChangeHigh: PropTypes.func.isRequired,
  onChangePos: PropTypes.func.isRequired
}

ZoomSlideBar.defaultProps = {
  Step: 1,
  Decimal: 0,
  BackUnit: '',
  Vertical: false,
  DisplayLabel: false
}

export default ZoomSlideBar
