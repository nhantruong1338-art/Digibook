import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const IconPlayMusicMini = (props: SvgProps) => (
  <Svg
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      d="m14.575 8-9.909 5.975a.88.88 0 0 1-1.333-.75V6.558C3.333 3.65 6.475 1.833 9 3.283l3.825 2.2 1.741 1c.575.342.584 1.175.009 1.517ZM15.075 12.883l-3.375 1.95-3.367 1.942a3.295 3.295 0 0 1-3.566-.15c-.484-.333-.425-1.075.083-1.375L15.442 8.9c.5-.3 1.158-.017 1.25.558.208 1.292-.325 2.684-1.617 3.425Z"
    />
  </Svg>
)
export default IconPlayMusicMini
