import React, { Component } from "react";
import "./index.scss";
import scrollendEvent from "./scrollEndEvent";
import scorllListener from "./scrollListener";
class DraggableCircle extends Component {
  static defaultProps = {
    left: 0,
    top: 0,
    style: "",
    className: "",
    endPadding: 20
  };
  width = 0;
  height = 0;

  constructor(props) {
    super(props);
    const { left, top } = this.props;

    this.circle = React.createRef();
    this.state = { left, top, show: false, showFloatCircle: false };
  }
  componentDidMount() {
    this.setConstant();
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
      () => {
        scorllListener(
          1,
          () =>
            this.setState({
              showFloatCircle: false
            }),
          () =>
            this.setState(
              {
                showFloatCircle: true
              },
              () => {
                this.setConstant();
              }
            )
        );
      },
      200
    );
  }

  setConstant = focusUpdate => {
    if ((this.width && this.height) || focusUpdate) {
      return;
    }
    const { endPadding } = this.props;
    const { width, height } = this.circle.current.getBoundingClientRect();
    this.width = width;
    this.height = height;
    this.maxW = window.innerWidth - this.width - endPadding;
    this.maxH = window.innerHeight - this.height - endPadding;
  };

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

    if (left + this.width / 2 <= window.innerWidth / 2) {
      this.assorptionAnimation("left");
    } else {
      this.assorptionAnimation("right");
    }
  };
  assorptionAnimation = bearing => {
    const displacement = 15;
    const { left } = this.state;
    const { endPadding } = this.props;

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
        if (left + this.width < window.innerWidth - endPadding) {
          this.setState({
            left:
              window.innerWidth - left - displacement - this.width < endPadding
                ? window.innerWidth - this.width - endPadding
                : left + displacement
          });
          requestAnimationFrame(() => this.assorptionAnimation(bearing));
        }
        break;
    }
  };
  render() {
    const { style, className } = this.props;
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
          style={{ ...style, left, top }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default DraggableCircle;
