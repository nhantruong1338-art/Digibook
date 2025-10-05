import * as React from "react"
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg"
const IconPause = (props: SvgProps) => (
  <Svg
    width={65}
    height={64}
    fill="none"
    {...props}
  >
    <Path
      fill="url(#a)"
      d="M.5 32c0-17.673 14.327-32 32-32 17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32-17.673 0-32-14.327-32-32Z"
    />
    <Path
      stroke="#fff"
      strokeOpacity={0.16}
      d="M32.5.5C49.897.5 64 14.603 64 32S49.897 63.5 32.5 63.5 1 49.397 1 32 15.103.5 32.5.5Z"
    />
    <Path
      fill="#fff"
      d="M30.7 41.48V22.52c0-1.8-.76-2.52-2.68-2.52h-4.84c-1.92 0-2.68.72-2.68 2.52v18.96c0 1.8.76 2.52 2.68 2.52h4.84c1.92 0 2.68-.72 2.68-2.52ZM44.5 41.48V22.52c0-1.8-.76-2.52-2.68-2.52h-4.84c-1.907 0-2.68.72-2.68 2.52v18.96c0 1.8.76 2.52 2.68 2.52h4.84c1.92 0 2.68-.72 2.68-2.52Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={13.014}
        x2={68.153}
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
export default IconPause
