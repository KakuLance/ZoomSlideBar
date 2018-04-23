import styled from 'styled-components'

export const Root = styled.div`
  position: relative;
  z-index: 1;

  display: flex;
  justify-content: center;
`

export const Content = styled.div`
  margin-top: 50px;
  margin-bottom: 50px;

  width: 800px;
  min-height: 600px;
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

export const XZoomer = styled.div`
  position: absolute;
  top: 5px;
  left: 0;
  right: 14px;
  z-index: 2;

  min-height: 14px;
`

export const YZoomer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 2;

  min-width: 14px;
`

export const ImageWrapper = styled.div`
  position: absolute;
  top: 19px;
  left: 0;
  right: 14px;
  bottom: 14px;
  z-index: 1;
`

export const Image = styled.img`
  width: 100%;
  height: 100%;
`

export const Shade = styled.div`
  position: absolute;
  top: ${(props) => props.top || 0};
  left: ${(props) => props.left || 0};
  right: ${(props) => props.right || '100%'};
  bottom: ${(props) => props.bottom || '100%'};

  background: #CDCDD5;
  opacity: 0.3;
`
