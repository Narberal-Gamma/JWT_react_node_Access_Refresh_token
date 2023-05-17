import $api from "../http";
import { IUser } from "../models/IUser";
import { AxiosResponse } from 'axios'

export default class UserService {
    static async fetchUsers(): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>('/users')
    }
}