import React, { Component } from "react";
import "./index.scss";
import scrollendEvent from "./scrollEndEvent";
import scorllListener from "./scrollListener";

class DraggableCircle extends Component {
  static defaultProps = {
    width: 100,
    height: 100,
    left: 0,
    top: 0,
    style: "",
    className: "",
    endPadding: 20
  };

  constructor(props) {
    super(props);
    const { left, top } = this.props;

    this.circle = React.createRef();
    this.state = { left, top, show: false, showFloatCircle: false };
  }
  componentDidMount() {
    const { width, height, endPadding } = this.props;
    this.maxW = window.innerWidth - width - endPadding;
    this.maxH = window.innerHeight - height - endPadding;
    this.oL = 0;
    this.oT = 0;

    // 绑定事件，阻止默认事件
    this.circle.current.addEventListener("touchstart", this.onTouchstart, {
      passive: false
    });
    this.circle.current.addEventListener("touchmove", this.onTouchmove, {
      passive: false
    });
    this.circle.current.addEventListener("touchend", this.onTouchend, {
      passive: false
    });

    // 绑定滚动结束事件
    scrollendEvent(
      () =>
        this.setState({
          showFloatCircle: false
        }),
      () =>
        scorllListener(
          1,
          () =>
            this.setState({
              showFloatCircle: true
            }),
          () =>
            this.setState({
              showFloatCircle: false
            })
        ),
      200
    );
  }

  onTouchstart = e => {
    let touch = e.targetTouches[0];
    this.oL = touch.clientX - this.circle.current.offsetLeft;
    this.oT = touch.clientY - this.circle.current.offsetTop;
  };

  onTouchmove = e => {
    e.preventDefault();
    const { endPadding } = this.props;
    let touch = e.targetTouches[0];
    let oLeft = touch.clientX - this.oL;
    let oTop = touch.clientY - this.oT;
    if (oLeft < endPadding) {
      oLeft = endPadding;
    } else if (oLeft >= this.maxW) {
      oLeft = this.maxW;
    }
    if (oTop < endPadding) {
      oTop = endPadding;
    } else if (oTop >= this.maxH) {
      oTop = this.maxH;
    }

    this.setState({
      top: oTop,
      left: oLeft
    });
  };
  onTouchend = () => {
    this.adsorption();
  };

  adsorption = () => {
    const { left } = this.state;
    const { width } = this.props;

    if (left + width / 2 <= window.innerWidth / 2) {
      this.assorptionAnimation("left");
    } else {
      this.assorptionAnimation("right");
    }
  };
  assorptionAnimation = bearing => {
    const displacement = 15;
    const { left } = this.state;
    const { endPadding, width } = this.props;

    switch (bearing) {
      case "left":
        if (left > endPadding) {
          this.setState({
            left:
              left - displacement < endPadding
                ? endPadding
                : left - displacement
          });
          requestAnimationFrame(() => this.assorptionAnimation(bearing));
        }
        break;
      case "right":
        if (left + width < window.innerWidth - endPadding) {
          this.setState({
            left:
              window.innerWidth - left - displacement - width < endPadding
                ? window.innerWidth - width - endPadding
                : left + displacement
          });
          requestAnimationFrame(() => this.assorptionAnimation(bearing));
        }
        break;
    }
  };
  render() {
    const { width, height, style, className } = this.props;
    const { left, top, showFloatCircle } = this.state;

    return (
      <div
        className={`float-container ${
          showFloatCircle ? "" : "float-container__hide"
        }`}
      >
        <div
          ref={this.circle}
          className={`float-circle  ${className} `}
          style={{ ...style, width, height, left, top }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default DraggableCircle;
