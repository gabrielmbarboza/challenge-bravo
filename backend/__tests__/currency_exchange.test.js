const dbHandler = require('../db/database_handler');
const CurrencyExchangeService =  require('../src/services/CurrencyExchangeService');

describe("CurrencyExchange", () => {
    beforeAll(async () => await dbHandler.dbConnect('hurb', 'test'));
    afterEach(async () => await dbHandler.dbClear());
    afterAll(async () => await dbHandler.dbClose());

    it("Deve retornar objeto com a taxa de cambio quando os parametros forem válidos", async () => {
        await CurrencyExchangeService.create(validCurrencyExchangeParams);
        const currencyExchange = await CurrencyExchangeService.findByBaseSymbol(validCurrencyExchangeParams.baseSymbol);

        expect(currencyExchange.baseSymbol).toBe(validCurrencyExchangeParams.baseSymbol);
        expect(currencyExchange.rates.length).toEqual(4);
        expect(Date.parse(currencyExchange.createdAt)).toBe(validCurrencyExchangeParams.createdAt);
    });

    it("Deve retornar último objeto com a taxa de cambio criado quando os parametros forem válidos", async () => {
        await CurrencyExchangeService.createMany(listCurrencyExchangeParams);
        const currencyExchange = await CurrencyExchangeService.findByBaseSymbol(validCurrencyExchangeParams.baseSymbol);
        const lastCurrencyExchangeParam = listCurrencyExchangeParams.pop();

        expect(Date.parse(currencyExchange.createdAt)).toBe(lastCurrencyExchangeParam.createdAt);
    });

    it("Deve ocorrer uma excessão quando os parametros forem inválidos", () => {
        expect(CurrencyExchangeService.create(invalidCurrencyExchangeParams))
        .rejects
        .toThrow('CurrencyExchange validation failed: baseSymbol: Path `baseSymbol` is required');
    });

    it("Deve ser falso quando remover a taxa de cambio", async () => {
        await CurrencyExchangeService.create(validCurrencyExchangeParams);
        await CurrencyExchangeService.delete(validCurrencyExchangeParams.baseSymbol)
        const currencyExchange = await CurrencyExchangeService.findByBaseSymbol(validCurrencyExchangeParams.baseSymbol);

        expect(currencyExchange).toBeFalsy();
    });

    it("Deve retornar o novo valor da moeda convertida", () => {
        const { rates } = validCurrencyExchangeParams;
        const amount = 123.45;
        const currencyConverted = CurrencyExchangeService.currencyConvert(rates[0].rate, amount);
        expect(currencyConverted).toEqual((665.3955).toFixed(2));
    });
});

const validCurrencyExchangeParams = {
    baseSymbol: 'USD',
    rates: [
        { symbol: 'BRL', rate: 5.39 },
        { symbol: 'EUR', rate: 0.8299 },
        { symbol: 'BTC', rate: 0.00002851 },
        { symbol: 'ETH', rate: 0.000837 },
    ],
    createdAt: Date.parse('2021-01-18')
}

const invalidCurrencyExchangeParams = {
    baseSymbol: null,
    rates: [
        { symbol: 'BRL', rate: 5.39 },
        { symbol: 'EUR', rate: 0.8299 },
        { symbol: 'BTC', rate: 0.00002851 },
        { symbol: 'ETH', rate: 0.000837 },
    ],
    createdAt: new Date()
}

const listCurrencyExchangeParams = [
    {
        baseSymbol: 'USD',
        rates: [
            { symbol: 'BRL', rate: 5.43 },
            { symbol: 'EUR', rate: 0.8199 },
            { symbol: 'BTC', rate: 0.00002951 },
            { symbol: 'ETH', rate: 0.000847 },
        ],
        createdAt: Date.parse('2021-01-17')
    },
    {
        baseSymbol: 'USD',
        rates: [
            { symbol: 'BRL', rate: 5.39 },
            { symbol: 'EUR', rate: 0.8299 },
            { symbol: 'BTC', rate: 0.00003851 },
            { symbol: 'ETH', rate: 0.000858 },
        ],
        createdAt: Date.parse('2021-01-18')
    },
    {
        baseSymbol: 'USD',
        rates: [
            { symbol: 'BRL', rate: 5.30 },
            { symbol: 'EUR', rate: 0.8398 },
            { symbol: 'BTC', rate: 0.00002091 },
            { symbol: 'ETH', rate: 0.000908 },
        ],
        createdAt: Date.parse('2021-01-19')
    }
];