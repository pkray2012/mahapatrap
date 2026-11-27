"""Make a Claude-artifact preview copy of dist/ (relative links, _astro -> assets). Usage: python3 scripts/make_preview.py OUT_DIR"""
import os,re,glob,shutil,sys,json
out=sys.argv[1]; shutil.rmtree(out,ignore_errors=True); shutil.copytree('dist',out)
os.rename(os.path.join(out,'_astro'),os.path.join(out,'assets'))
def rel(target,page_dir):
    path=target.split('#')[0]; frag=target[len(path):]
    path=path.replace('/_astro/','/assets/')
    if path.endswith('/'): path+='index.html'
    return os.path.relpath(os.path.join(out,path.lstrip('/')),page_dir)+frag
for f in glob.glob(out+'/**/*.html',recursive=True):
    d=os.path.dirname(f); t=open(f,encoding='utf-8').read()
    def sub(m):
        a,q,v=m.group(1),m.group(2),m.group(3)
        if a=='srcset':
            ps=[]
            for p in v.split(','):
                b=p.strip().split(' ',1)
                if b[0].startswith('/') and not b[0].startswith('//'): b[0]=rel(b[0],d)
                ps.append(' '.join(b))
            return f'{a}={q}{", ".join(ps)}{q}'
        if v.startswith('/') and not v.startswith('//'): v=rel(v,d)
        return f'{a}={q}{v}{q}'
    t=re.sub(r'\b(href|src|srcset)=(["\'])([^"\']*)\2',sub,t)
    open(f,'w',encoding='utf-8').write(t)
files=[]
for r,_,fs in os.walk(out):
    for x in fs:
        p=os.path.relpath(os.path.join(r,x),out)
        if p in ('robots.txt','sitemap.xml'): continue
        files.append({'as':p,'path':os.path.abspath(os.path.join(r,x))})
print(json.dumps(files))
