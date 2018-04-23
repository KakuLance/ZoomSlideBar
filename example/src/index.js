import React from 'react'
import ReactDOM from 'react-dom'

import ZoomSlideBar from '../../src'
import world from './world.png'

import {
  Root,
  Content,
  XZoomer,
  YZoomer,
  ImageWrapper,
  Image,
  Shade
} from './style'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      low: 0,
      high: 100,
      vLow: 0,
      vHigh: 100
    }

    this.onChangeSinglePos = this.onChangeSinglePos.bind(this)
    this.onChangeBothPos = this.onChangeBothPos.bind(this)
  }

  onChangeSinglePos(posKey, value) {
    return this.setState({ [posKey]: value })
  }

  onChangeBothPos(isVertical, lowPos, highPos) {
    const lowPosKey = isVertical ? 'vLow' : 'low'
    const highPosKey = isVertical ? 'vHigh' : 'high'

    return this.setState({
      [lowPosKey]: lowPos,
      [highPosKey]: highPos
    })
  }

  render() {
    return (
      <Root>
        <Content>
          <XZoomer>
            <ZoomSlideBar
              Low={this.state.low}
              High={this.state.high}
              Max={100}
              Min={0}
              onChangeLow={(value) => this.onChangeSinglePos('low', value)}
              onChangeHigh={(value) => this.onChangeSinglePos('high', value)}
              onChangePos={(low, high) => this.onChangeBothPos(false, low, high)} />
          </XZoomer>

          <YZoomer>
            <ZoomSlideBar
              Vertical
              Low={this.state.vLow}
              High={this.state.vHigh}
              Max={100}
              Min={0}
              onChangeLow={(value) => this.onChangeSinglePos('vLow', value)}
              onChangeHigh={(value) => this.onChangeSinglePos('vHigh', value)}
              onChangePos={(low, high) => this.onChangeBothPos(true, low, high)} />
          </YZoomer>

          <ImageWrapper>
            <Image src={world} />

            <Shade
              bottom={`${100 - this.state.vLow}%`}
              right={'0'}/>

            <Shade
              right={'0'}
              bottom={'0'}
              top={`${this.state.vHigh}%`}/>

            <Shade
              bottom={'0'}
              right={'0'}
              left={`${this.state.high}%`}/>

            <Shade
              bottom={'0'}
              right={`${100 - this.state.low}%`}/>
          </ImageWrapper>
        </Content>
      </Root>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('react-root'))
