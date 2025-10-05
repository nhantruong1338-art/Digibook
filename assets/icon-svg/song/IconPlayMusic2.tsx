import * as React from "react"
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg"
const IconPlayMusic2 = (props: SvgProps) => (
  <Svg
    width={64}
    height={64}
    fill="none"
    {...props}
  >
    <Path
      fill="url(#a)"
      d="M0 32C0 14.327 14.327 0 32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32Z"
    />
    <Path
      stroke="#fff"
      strokeOpacity={0.16}
      d="M32 .5C49.397.5 63.5 14.603 63.5 32S49.397 63.5 32 63.5.5 49.397.5 32 14.603.5 32 .5Z"
    />
    <Path
      fill="#fff"
      d="m40.32 28.8-15.854 9.56c-.933.56-2.133-.107-2.133-1.2V26.493c0-4.653 5.027-7.56 9.067-5.24l6.12 3.52 2.786 1.6c.92.547.934 1.88.014 2.427ZM41.12 36.613l-5.4 3.12-5.386 3.107c-1.934 1.107-4.12.88-5.707-.24-.773-.533-.68-1.72.133-2.2l16.947-10.16c.8-.48 1.853-.027 2 .893.333 2.067-.52 4.294-2.587 5.48Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={12.514}
        x2={67.653}
        y1={0}
        y2={31.508}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#EC38BC" />
        <Stop offset={0.9} stopColor="#831FE0" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default IconPlayMusic2
