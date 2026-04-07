"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseBrowser = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
var supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase browser client is missing environment variables.');
}
exports.supabaseBrowser = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
