import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database";
import { getSession } from "@/lib/auth";

export async function GET(){
  const user=await getSession();
  const classes=db.prepare(`SELECT c.*,u.name tutor_name,(SELECT COUNT(*) FROM enrollments e WHERE e.class_id=c.id AND e.status='enrolled') enrolled FROM classes c LEFT JOIN users u ON u.id=c.tutor_id ORDER BY c.starts_at`).all();
  if(!user) return NextResponse.json({user:null,classes});
  const notifications=db.prepare("SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 20").all(user.id);
  const myClasses=user.role==="student"?db.prepare(`SELECT c.*,u.name tutor_name,e.attendance FROM enrollments e JOIN classes c ON c.id=e.class_id LEFT JOIN users u ON u.id=c.tutor_id WHERE e.student_id=?`).all(user.id):user.role==="tutor"?db.prepare(`SELECT c.*,(SELECT COUNT(*) FROM enrollments e WHERE e.class_id=c.id) enrolled FROM classes c WHERE tutor_id=?`).all(user.id):classes;
  const people=user.role==="admin"?db.prepare("SELECT id,name,email,role,country,age,created_at FROM users ORDER BY created_at DESC").all():[];
  return NextResponse.json({user,classes,myClasses,notifications,people});
}

export async function POST(req:NextRequest){
  const user=await getSession(); if(!user) return NextResponse.json({error:"Sign in required."},{status:401});
  const body=await req.json();
  if(body.action==="enroll"){
    if(user.role!=="student") return NextResponse.json({error:"Only student accounts can enroll."},{status:403});
    const cls=db.prepare("SELECT * FROM classes WHERE id=?").get(body.classId) as {title:string,capacity:number}|undefined; if(!cls) return NextResponse.json({error:"Class not found."},{status:404});
    const count=(db.prepare("SELECT COUNT(*) count FROM enrollments WHERE class_id=?").get(body.classId) as {count:number}).count; if(count>=cls.capacity) return NextResponse.json({error:"This class is full."},{status:409});
    try { db.prepare("INSERT INTO enrollments (class_id,student_id) VALUES (?,?)").run(body.classId,user.id); db.prepare("INSERT INTO notifications (user_id,title,message,kind) VALUES (?,?,?,?)").run(user.id,"Enrollment confirmed",`You are enrolled in ${cls.title}.`,"success"); return NextResponse.json({ok:true}); } catch { return NextResponse.json({error:"You are already enrolled."},{status:409}); }
  }
  if(body.action==="readNotifications"){ db.prepare("UPDATE notifications SET is_read=1 WHERE user_id=?").run(user.id); return NextResponse.json({ok:true}); }
  if(body.action==="createClass"){
    if(!["admin","tutor"].includes(user.role)) return NextResponse.json({error:"Tutor or admin access required."},{status:403});
    const tutorId=user.role==="tutor"?user.id:Number(body.tutorId)||null;
    const info=db.prepare("INSERT INTO classes (title,program,description,starts_at,duration,capacity,tutor_id,meeting_url) VALUES (?,?,?,?,?,?,?,?)").run(body.title,body.program,body.description||"",body.startsAt,Number(body.duration)||60,Number(body.capacity)||10,tutorId,body.meetingUrl||"");
    return NextResponse.json({ok:true,id:Number(info.lastInsertRowid)});
  }
  return NextResponse.json({error:"Unknown action."},{status:400});
}
