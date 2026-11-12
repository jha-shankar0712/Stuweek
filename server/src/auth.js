import jwt from 'jsonwebtoken';
export function auth(req,res,next){const h=req.headers.authorization||'';const token=h.startsWith('Bearer ')?h.slice(7):null;if(!token)return res.status(401).json({error:'Sign in required'});try{req.user=jwt.verify(token,process.env.JWT_SECRET||'dev_only_change_me');next();}catch{return res.status(401).json({error:'Session expired. Please sign in again.'});}}
export function makeToken(user){return jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET||'dev_only_change_me',{expiresIn:'7d'});}
