import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/database";
import { createToken, getSession, SessionUser } from "@/lib/auth";

export async function GET(){ return NextResponse.json({user: await getSession()}); }
export async function POST(req:NextRequest){
  const body = await req.json();
  if(body.action === "logout") { const res=NextResponse.json({ok:true}); res.cookies.set("ear_session","",{maxAge:0,path:"/"}); return res; }
  if(body.action === "register"){
    const {name,email,password,role,country,age}=body;
    if(!name || !email || !password || !["student","tutor"].includes(role)) return NextResponse.json({error:"Please complete every required field."},{status:400});
    if(password.length < 8) return NextResponse.json({error:"Password must be at least 8 characters."},{status:400});
    try { const info=db.prepare("INSERT INTO users (name,email,password_hash,role,country,age) VALUES (?,?,?,?,?,?)").run(name,email.toLowerCase(),bcrypt.hashSync(password,10),role,country||"",age||null); const user={id:Number(info.lastInsertRowid),name,email:email.toLowerCase(),role} as SessionUser; db.prepare("INSERT INTO notifications (user_id,title,message,kind) VALUES (?,?,?,?)").run(user.id,"Welcome to Equal Access Robotics","Your portal is ready. Start by exploring available classes.","success"); return sessionResponse(user); }
    catch { return NextResponse.json({error:"An account with that email already exists."},{status:409}); }
  }
  const row=db.prepare("SELECT id,name,email,password_hash,role FROM users WHERE email=?").get(String(body.email||"").toLowerCase()) as (SessionUser&{password_hash:string})|undefined;
  if(!row || !bcrypt.compareSync(body.password||"",row.password_hash)) return NextResponse.json({error:"Incorrect email or password."},{status:401});
  return sessionResponse({id:row.id,name:row.name,email:row.email,role:row.role});
}
async function sessionResponse(user:SessionUser){ const token=await createToken(user); const res=NextResponse.json({user}); res.cookies.set("ear_session",token,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",maxAge:604800,path:"/"}); return res; }
