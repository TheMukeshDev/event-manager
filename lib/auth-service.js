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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_EMAILS = void 0;
exports.isAdminEmail = isAdminEmail;
exports.seedAdminProfiles = seedAdminProfiles;
exports.createAuthUserWithPassword = createAuthUserWithPassword;
exports.signInWithEmailPassword = signInWithEmailPassword;
exports.signInWithGoogle = signInWithGoogle;
var supabase_browser_1 = require("./supabase-browser");
var supabase_server_1 = require("./supabase-server");
exports.ADMIN_EMAILS = [
    'mukeshkumar916241@gmail.com',
    'shwetatiwari.8060@gmail.com',
    'techwitharyan2211@gmail.com',
    'deepatiwari221503@gmail.com',
];
var ADMIN_PROFILE_MAP = {
    'mukeshkumar916241@gmail.com': { full_name: 'Mukesh Kumar', role: 'admin' },
    'shwetatiwari.8060@gmail.com': { full_name: 'Shweta Tiwari', role: 'admin' },
    'techwitharyan2211@gmail.com': { full_name: 'Aryaman Patel', role: 'admin' },
    'deepatiwari221503@gmail.com': { full_name: 'Deepa Tiwari', role: 'admin' },
};
function isAdminEmail(email) {
    return exports.ADMIN_EMAILS.includes(email.toLowerCase());
}
function seedAdminProfiles() {
    return __awaiter(this, void 0, void 0, function () {
        var profiles, _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    profiles = Object.entries(ADMIN_PROFILE_MAP).map(function (_a) {
                        var email = _a[0], profile = _a[1];
                        return ({
                            email: email,
                            full_name: profile.full_name,
                            role: profile.role,
                        });
                    });
                    return [4 /*yield*/, supabase_server_1.supabaseServer
                            .from('users')
                            .upsert(profiles, { onConflict: 'email' })
                            .select()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error('Admin seed failed:', error.message);
                        return [2 /*return*/, { success: false, error: error.message }];
                    }
                    return [2 /*return*/, { success: true, adminProfiles: data }];
            }
        });
    });
}
function createAuthUserWithPassword(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var email, password, fullName, phone, college, stream, role, _a, authData, authError, _b, profile, profileError;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    email = payload.email, password = payload.password, fullName = payload.fullName, phone = payload.phone, college = payload.college, stream = payload.stream;
                    role = isAdminEmail(email) ? 'admin' : 'participant';
                    return [4 /*yield*/, supabase_server_1.supabaseServer.auth.admin.createUser({
                            email: email,
                            password: password,
                            user_metadata: {
                                full_name: fullName,
                                phone: phone,
                                college: college,
                                stream: stream,
                            },
                        })];
                case 1:
                    _a = _d.sent(), authData = _a.data, authError = _a.error;
                    if (authError) {
                        return [2 /*return*/, { success: false, error: authError.message }];
                    }
                    return [4 /*yield*/, supabase_server_1.supabaseServer
                            .from('users')
                            .upsert([
                            {
                                email: email,
                                full_name: fullName,
                                phone: phone,
                                college: college,
                                stream: stream,
                                role: role,
                            },
                        ], { onConflict: 'email' })
                            .select()
                            .single()];
                case 2:
                    _b = _d.sent(), profile = _b.data, profileError = _b.error;
                    if (profileError) {
                        return [2 /*return*/, { success: false, error: profileError.message }];
                    }
                    return [2 /*return*/, {
                            success: true,
                            authUser: (_c = authData.user) !== null && _c !== void 0 ? _c : null,
                            profile: profile,
                        }];
            }
        });
    });
}
function signInWithEmailPassword(email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, supabase_browser_1.supabaseBrowser.auth.signInWithPassword({
                        email: email,
                        password: password,
                    })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        return [2 /*return*/, { success: false, error: error.message }];
                    }
                    return [2 /*return*/, { success: true, session: data.session, user: data.user }];
            }
        });
    });
}
function signInWithGoogle() {
    return supabase_browser_1.supabaseBrowser.auth.signInWithOAuth({
        provider: 'google',
        options: {
            scopes: 'email profile',
        },
    });
}
