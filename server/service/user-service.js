const UserModel = require('../model/user_model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const emailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({ email })
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтой ${email} уже существует`)
        }
        const salt = await bcrypt.genSalt(7)
        const hashPass = await bcrypt.hash(password, salt)
        const activationLink = uuid.v4()

        const user = await UserModel.create({ email, password: hashPass, activationLink })

        const userDto = new UserDto(user) // id, email, isActivated

        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        await emailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)

        return { ...tokens, user: userDto }
    }

    async login(email, password) {
        const user = await UserModel.findOne({ email })
        if (!user) {
            throw ApiError.BadRequest("Пользователь с такой почтой не найден")
        }
        const isValidPass = await bcrypt.compare(password, user.password)
        if (!isValidPass) {
            throw ApiError.BadRequest("Некорректный пароль")
        }

        const userDto = new UserDto(user)

        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeRefreshToken(refreshToken)
        return token
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({ activationLink })
        if (!user) {
            throw ApiError.BadRequest('Некорректная ссылка')
        }
        user.isActivated = true
        await user.save()
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validationRefreshToken(refreshToken)
        const tokenFromDB = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDB) {
            throw ApiError.UnauthorizedError()
        }
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user)

        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }

    }

    async getAllUsers() {
        const users = await UserModel.find()
        return users
    }
}

module.exports = new UserService()