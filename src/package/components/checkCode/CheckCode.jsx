import React from "react";
import propTypes from 'prop-types'
import "./checkCode.scss"



/*生成4位随机字符*/
function rand(count = 1) {
    let randArr = []
    // 数字0-9
    for (let i = 0; i <= 9; i++) {
        randArr.push(i)
    }
    // 字母大小写
    for (let i = 0; i < 26; i++) {
        randArr.push(String.fromCharCode(i + 65))
    }
    for (let i = 0; i < 26; i++) {
        randArr.push(String.fromCharCode(i + 97))
    }
    let validate = "";
    let ranNum;
    for (let i = 0; i < count; i++) {
        ranNum = Math.floor(Math.random() * randArr.length);
        validate += randArr[ranNum];
    }
    return validate;

}

/*干扰线的随机x坐标值*/
function lineX() {
    var ranLineX = Math.floor(Math.random() * 90);
    return ranLineX;

}

/*干扰线的随机y坐标值*/
function lineY() {
    var ranLineY = Math.floor(Math.random() * 40);
    return ranLineY;

}


/**
* 随机颜色
* @return 十六进制颜色值（#aaaaaa）
*/
let colorArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f']
function colorRandFun() {
    function color() {
        return colorArr[Math.floor(Math.random() * colorArr.length)]
    }
    return `#${color()}${color()}${color()}${color()}${color()}${color()}`
}


export default class CheckCode extends React.Component {

    static propTypes = {
        width: propTypes.oneOfType([propTypes.string, propTypes.number]),
        height: propTypes.oneOfType([propTypes.string, propTypes.number]),
        style: propTypes.object
    }

    static defaultProps = {
        width: 100,
        height: 32
    }

    code = ""
    canvas = null

    checkCode = (code) => {
        return code.toLowerCase() === this.code.toLowerCase()
    }

    componentDidMount = () => {
        const width = parseInt(this.props.width)
        const height = parseInt(this.props.height)
        const ctx = this.canvas.getContext("2d")
        ctx.fillStyle = "whitesmoke";
        ctx.fillRect(0, 0, width, height);
        /*生成干扰线20条*/
        for (var j = 0; j < 10; j++) {
            ctx.strokeStyle = colorRandFun();
            ctx.beginPath();    //若省略beginPath，则每点击一次验证码会累积干扰线的条数
            ctx.moveTo(lineX(), lineY());
            ctx.lineTo(lineX(), lineY());
            ctx.lineWidth = 0.5;
            ctx.closePath();
            ctx.stroke();
        }
        let code = ""
        let startX = 10
        for (let i = 0; i < 4; i++) {
            ctx.fillStyle = colorRandFun();
            ctx.font = `bold ${height*4/5}px Arial`;
            const char = rand()
            code += char
            ctx.fillText(char, startX, height * 4 / 5);   //把rand()生成的随机数文本填充到canvas中
            startX += (width - 20) / 4
        }
        this.code = code
    }

    render() {
        return (
            <canvas
                style={this.props.style}
                id="checkCode"
                ref={ref => this.canvas = ref}
                width={this.props.width || "100px"}
                height={this.props.height || "32px"}
                onClick={this.componentDidMount}
            >您的浏览器不支持 HTML5 canvas 标签</canvas>
        )
    }

}