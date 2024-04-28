const {Game} = require('./game.js')

describe('game test', () => {
    // it('first test', ()=>{
    //     const game = new Game()
    //     expect(game.test()).toBe('init')
    // })

    it('init test', () => {
        const game = new Game()

        game.settings = {
            gridSize: {
                columns: 4,
                rows: 5
            }
        }

        expect(game.settings.gridSize.columns).toBe(4)
        expect(game.settings.gridSize.rows).toBe(5)
    })

    it('start game', async () => {
        const game = new Game()

        game.settings = {
            gridSize: {
                columns: 1,
                rows: 3
            }
        }

        expect(game.status).toBe('pending')
        await game.start()
        expect(game.status).toBe('in-process')

    })

    it('check players start positions', async () => {
        for (let i = 0; i < 10; i++) {
            const game = new Game()

            game.settings = {
                gridSize: {
                    columns: 1,
                    rows: 3
                }
            }

            await game.start()

            expect([1]).toContain(game.player1.position.x)
            expect([1, 2, 3]).toContain(game.player1.position.y)

            expect([1]).toContain(game.player2.position.x)
            expect([1, 2, 3]).toContain(game.player2.position.y)

            expect([1]).toContain(game.google.position.x)
            expect([1, 2, 3]).toContain(game.google.position.y)

            expect(
                (game.player1.position.x !== game.player2.position.x ||
                    game.player1.position.y !== game.player2.position.y) &&
                (game.player1.position.x !== game.google.position.x ||
                    game.player1.position.y !== game.google.position.y) &&
                (game.player2.position.x !== game.google.position.x ||
                    game.player2.position.y !== game.google.position.y)
            ).toBe(true)

            //console.log('player1.position', game.player1.position)
            //console.log('player2.position', game.player2.position)
            //console.log('google.position', game.google.position)
        }
    })
})