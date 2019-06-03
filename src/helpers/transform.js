export function sin(angle) {
  return Math.sin(angle / 180 * Math.PI)
}
export function cos(angle) {
  return Math.cos(angle / 180 * Math.PI)
}
export function tan(angle) {
  return Math.tan(angle / 180 * Math.PI)
}
export function atan(value) {
  return Math.atan(value) / Math.PI * 180
}

export function polar2xy(r, theta, x0, y0) {
  return {
    x: r * cos(theta) + x0,
    y: r * sin(theta) + y0
  }
}

export function xy2polar(x, y, x0, y0) {
  let r = Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2))
  let theta
  if (x == x0) {
    if (y > y0) {
      theta = 90
    } else if (y < y0) {
      theta = 270
    } else {
      theta = 0
    }
  } else if (x > x0) {
    theta = atan((y - y0) / (x - x0))
  } else {
    theta = 180 + atan((y - y0) / (x - x0))
  }
  return {
    r: r,
    theta: theta
  }
}


// 计算x,y绕x0,y0旋转rotation角度后，再根据拉伸后的中心x01, y01旋转回来后的坐标
export function trans1(x, y, x0, y0, x01, y01, rotation) {
  let result = xy2polar(x, y, x0, y0)
  let r1 = result.r
  let theta1 = result.theta
  result = polar2xy(r1, theta1 + rotation, x0, y0)
  let x2 = result.x
  let y2 = result.y
  result = xy2polar(x2, y2, x01, y01)
  let r2 = result.r
  let theta2 = result.theta
  return polar2xy(r2, theta2 - rotation, x01, y01);
}

// 计算x,y绕x0, y0旋转rotation角度后，再根据极坐标中拉伸后的增量r(角度不变)来计算旋转回来后的坐标
export function trans2(x, y, x0, y0, r, rotation) {
  let result = xy2polar(x, y, x0, y0)
  let r1 = result.r
  let theta1 = result.theta
  let r2 = r1
  let theta2 = theta1 + rotation
  let r3 = r2 + r
  let theta3 = theta2
  result = polar2xy(r, theta1 + rotation + 180, x0, y0)
  return polar2xy(r3, theta3 - rotation, result.x, result.y)
}
