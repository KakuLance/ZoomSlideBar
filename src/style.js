import styled from 'styled-components'

const medium = 500

const greyLight = '#CDCDD5'
const greyMedium = '#525A6B'
const grey = '#8B949C'

export const Root = styled.div`

`

export const Bar = styled.div`
  position: absolute;
  top: ${(props) => props.vertical ? 14 : 0}px;
  right: ${(props) => props.vertical ? 0 : 14}px;

  ${(props) => !props.vertical && `
    left: 14px;
  `}

  ${(props) => props.vertical && `
    bottom: 14px;
    border-bottom: none;
  `}
`

export const Label = styled.div`
  position: absolute;
  bottom: 8px;
  font-size: 13px;
  font-weight: ${medium};
  color: ${greyMedium};

  ${(props) => props.posStyle}
`

export const Dot = styled.div`
  opacity: 0.3;

  width: 14px;
  height: 14px;

  border: 2px solid ${grey};
  background: ${grey};
  border-radius: 4px;

  cursor: pointer;
  transform: ${(props) => props.vertical ? 'translate(50%, 0)' : 'translateY(50%)'};

  position: absolute;

  ${(props) => !props.vertical && `
    bottom: 0;
  `}

  ${(props) => props.vertical && `
    right: 0;
  `}

  ${(props) => props.posStyle}
`

export const PosBar = styled.div`
  opacity: 0.3;

  background: ${greyLight};
  cursor: pointer;
  transform: ${(props) => props.vertical ? 'translate(50%, 0)' : 'translateY(50%)'};

  position: absolute;

  ${(props) => !props.vertical && `
    height: 8px;
    bottom: 0;
  `}

  ${(props) => props.vertical && `
    right: 0;
    width: 8px;
  `}

  ${(props) => props.posStyle}
`
