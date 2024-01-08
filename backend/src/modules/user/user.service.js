"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUsers = exports.findUserByEmail = exports.createUser = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const hash_1 = require("../../utils/hash");
function createUser(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const { password } = input, rest = __rest(input, ["password"]);
        const { hash, salt } = (0, hash_1.hashPassword)(password);
        return prisma_1.default.user.create({
            // eslint-disable-next-line
            // @ts-ignore
            data: Object.assign({ salt: salt, password: hash }, rest),
        });
    });
}
exports.createUser = createUser;
function findUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
    });
}
exports.findUserByEmail = findUserByEmail;
function findUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.default.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
            },
        });
    });
}
exports.findUsers = findUsers;
