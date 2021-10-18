export class Vector2 {
  readonly x: number
  readonly y: number

  constructor (x: number, y: number) {
    this.x = x
    this.y = y
  }

  static zero () {
    return new Vector2(0, 0)
  }

  mag (to: Vector2 = Vector2.zero()): number {
    return Math.sqrt(((this.x - to.x) ** 2) + ((this.y - to.y) ** 2))
  }

  mul (q: number): Vector2 {
    return new Vector2(q * this.x, q * this.y)
  }

  div (q: number): Vector2 {
    return this.mul(1 / q)
  }

  unit (): Vector2 {
    return this.div(this.mag())
  }

  neg (): Vector2 {
    return this.mul(-1)
  }

  add (other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y)
  }

  sub (other: Vector2): Vector2 {
    return this.add(other.neg())
  }

  ccw (deg: number): Vector2 {
    const rad = deg * Math.PI / 180
    const sin = Math.sin(rad)
    const cos = Math.cos(rad)
    return new Vector2((this.x * cos) - (this.y * sin), (this.x * sin) + (this.y * cos))
  }

  cw (deg: number): Vector2 {
    return this.ccw(-deg)
  }

  manhattan (to: Vector2 = Vector2.zero()): number {
    const d = this.sub(to)
    return Math.abs(d.x) + Math.abs(d.y)
  }
}
