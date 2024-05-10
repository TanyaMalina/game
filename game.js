export class Game {
    #settings = {
        gridSize: {
            columns: 4,
            rows: 4
        },
        googleJumpInterval: 2000,
        pointsToWin: 10
    }
    #status = 'pending'
    #player1
    #player2
    #google
    #googleJumpIntervalId
    #score = {
        1: {points: 0},
        2: {points: 0}
    }

    constructor() {
    }

    #getRandomPosition(coordinates) {
        let newX, newY

        do {
            newX = NumberUtils.getRandomNumber(this.settings.gridSize.columns)
            newY = NumberUtils.getRandomNumber(this.settings.gridSize.rows)

        } while (coordinates.some(el => el.x === newX && el.y === newY))

        return new Position(newX, newY)
    }

    #createUnits() {
        const player1Position = this.#getRandomPosition([])
        this.#player1 = new Player(1, player1Position)

        const player2Position = this.#getRandomPosition([player1Position])
        this.#player2 = new Player(2, player2Position)

        // const googlePosition = this.#getRandomPosition([player1Position, player2Position])
        // this.#google = new Google(googlePosition)

        this.#moveGoogleToRandomPosition(true)
    }

    #runGoogleJumpInterval() {
        this.#googleJumpIntervalId = setInterval(() => {
            this.#moveGoogleToRandomPosition()
        }, this.#settings.googleJumpInterval)
    }

    async start() {
        if (this.#status === 'pending') {
            this.#createUnits()
            this.#status = 'in-process'
        }
        this.#runGoogleJumpInterval()
    }

    async stop() {
        clearInterval(this.#googleJumpIntervalId)
    }

    async finishGame() {
        clearInterval(this.#googleJumpIntervalId)
        this.#google.position = new Position(0, 0)
        this.#status = 'finished'
    }

    #moveGoogleToRandomPosition(excludeGoogle) {
        let notCrossedPosition = [this.player1.position, this.player2.position]

        if (!excludeGoogle) {
            notCrossedPosition.push(this.#google.position)
        }

        this.#google = new Google(this.#getRandomPosition(notCrossedPosition))
    }

    #checkBorders(player, delta) {
        const newPosition = player.position.clone()

        if (delta.x) newPosition.x += delta.x
        if (delta.y) newPosition.y += delta.y

        if (newPosition.x < 1 || newPosition.x > this.#settings.gridSize.columns) {
            return true
        }

        if (newPosition.y < 1 || newPosition.y > this.#settings.gridSize.rows) {
            return true
        }

        return false
    }

    #checkOtherPlayer(movingPlayer, otherPlayer, delta) {
        const newPosition = movingPlayer.position.clone()

        if (delta.x) newPosition.x += delta.x
        if (delta.y) newPosition.y += delta.y

        return otherPlayer.position.equal(newPosition)
    }

    async #checkGoogleCatching(player) {

        if (this.#google.position.equal(player.position)) {
            this.#score[player.id].points++

            if (this.#score[player.id].points === this.#settings.pointsToWin) {
                //clearInterval(this.#googleJumpIntervalId)
                await this.finishGame()
            } else {
                this.#moveGoogleToRandomPosition()
            }
        }
    }

    #movePlayer(movingPlayer, otherPlayer, delta) {
        const isBorder = this.#checkBorders(movingPlayer, delta)
        if (isBorder) return

        const isOtherPlayer = this.#checkOtherPlayer(movingPlayer, otherPlayer, delta)
        if (isOtherPlayer) return


        if (delta.x) movingPlayer.position.x += delta.x
        if (delta.y) movingPlayer.position.y += delta.y

        this.#checkGoogleCatching(movingPlayer)
    }

    movePlayer1Right() {
        const delta = {x: 1}
        this.#movePlayer(this.#player1, this.#player2, delta)
    }

    movePlayer1Left() {
        const delta = {x: -1}
        this.#movePlayer(this.#player1, this.#player2, delta)
    }

    movePlayer1Up() {
        const delta = {y: -1}
        this.#movePlayer(this.#player1, this.#player2, delta)
    }

    movePlayer1Down() {
        const delta = {y: 1}
        this.#movePlayer(this.#player1, this.#player2, delta)
    }

    movePlayer2Right() {
        const delta = {x: 1}
        this.#movePlayer(this.#player2, this.#player1, delta)
    }

    movePlayer2Left() {
        const delta = {x: -1}
        this.#movePlayer(this.#player2, this.#player1, delta)
    }

    movePlayer2Up() {
        const delta = {y: -1}
        this.#movePlayer(this.#player2, this.#player1, delta)
    }

    movePlayer2Down() {
        const delta = {y: 1}
        this.#movePlayer(this.#player2, this.#player1, delta)
    }

    set settings(settings) {
        if (settings.gridSize.columns * settings.gridSize.rows < 3) {
            throw new Error("grid size too small")
        }

        this.#settings = {...this.settings, ...settings}
        this.#settings.gridSize = settings.gridSize ?
            {...this.#settings.gridSize, ...settings.gridSize}
            : this.#settings.gridSize
    }

    get settings() {
        return this.#settings
    }

    get status() {
        return this.#status
    }

    get player1() {
        return this.#player1
    }

    get player2() {
        return this.#player2
    }

    get google() {
        return this.#google
    }

    get score() {
        return this.#score
    }
}

class Position {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    clone() {
        return new Position(this.x, this.y)
    }

    equal(otherPosition) {
        return otherPosition.x === this.x && otherPosition.y === this.y
    }
}

class Unit {
    constructor(position) {
        this.position = position
    }
}

class Player extends Unit {
    constructor(id, position) {
        super(position)
        this.id = id
    }
}

class Google extends Unit {
    constructor(position) {
        super(position)
    }
}

class NumberUtils {
    static getRandomNumber(max) {
        return Math.floor(Math.random() * max + 1)

    }
}

module.exports = {
    Game
}