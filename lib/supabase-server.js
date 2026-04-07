"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseServer = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
var supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase server client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}
exports.supabaseServer = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceRoleKey);
