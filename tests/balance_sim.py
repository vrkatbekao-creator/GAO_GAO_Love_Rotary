"""Runs deterministic policy agents as test fixtures, not autonomous LLM agents."""
import sys,random,json,statistics,collections
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'src'))
from engine import Game,ZONES
ROOT=Path(__file__).resolve().parents[1]

ROUTES=[('港灣區','舊城區'),('舊城區','山城區'),('舊城區','郊區'),('港灣區','科技區')]

def action_options(g):
    moves=[{'type':'rest'},{'type':'hearing'}]
    moves += [{'type':'wheel','zone':z} for z in ZONES if not any(b.type=='wheel' and b.zone==z for b in g.buildings)]
    moves += [{'type':'market','zone':z} for z in ZONES if not any(b.type=='market' and b.zone==z for b in g.buildings)]
    for i,z in enumerate(ZONES):
      for w in ZONES[i+1:]:
        if not any(b.type=='shuttle' and {b.zone,b.to_zone}=={z,w} for b in g.buildings):
          moves.append({'type':'shuttle','zone':z,'to_zone':w})
    if g.debt>0 and g.budget>0: moves.append({'type':'repay','amount':2})
    return moves

def policy(g,name,rng):
    if g.turn==1:return {'type':'wheel','zone':'港灣區'}
    n=g.turn-2
    route=lambda ix:{'type':'shuttle','zone':ROUTES[ix][0],'to_zone':ROUTES[ix][1]}
    if name=='transit':
        plan=[route(0),route(1),route(2),route(3), {'type':'market','zone':'港灣區'}, {'type':'market','zone':'山城區'}, {'type':'market','zone':'郊區'}, {'type':'hearing'},{'type':'hearing'}, {'type':'event','zone':'港灣區'}, {'type':'rest'}]
    elif name=='wheel_heavy':
        plan=[{'type':'wheel','zone':z} for z in ZONES[1:]] + [route(0),route(1),{'type':'hearing'}, {'type':'rest'},{'type':'rest'},{'type':'rest'},{'type':'rest'}]
    elif name=='market_first':
        plan=[{'type':'market','zone':z} for z in ZONES] + [route(0),route(1),route(2),route(3), {'type':'hearing'}, {'type':'rest'}]
    elif name=='passive':
        plan=[{'type':'rest'}]*11
    elif name=='balanced':
        plan=[{'type':'market','zone':'港灣區'},route(0),route(1),route(2),route(3),{'type':'market','zone':'舊城區'}, {'type':'market','zone':'山城區'}, {'type':'hearing'},{'type':'hearing'}, {'type':'event','zone':'港灣區'}, {'type':'repay','amount':2}]
    else:
        opts=action_options(g)
        rng.shuffle(opts)
        return opts[0]
    return plan[n] if n<len(plan) else {'type':'rest'}

def simulate(name,seed):
    g=Game(seed=seed);rng=random.Random(seed+100000)
    for i in range(12):
      act=policy(g,name,rng)
      try:g.play(act, rng.choice(('A','B')))
      except ValueError as e:
        if 'Construction credit limit exceeded' in str(e):g.play({'type':'rest'},rng.choice(('A','B')))
        else:raise
    snap=g.snapshot()
    return {'ending':snap['ending'],'budget':snap['budget'],'debt':snap['debt'],
            'coverage':len(snap['coverage']),'tourism':snap['tourism'],'admin':snap['admin'],
            'complaints':snap['complaints'],'wheels':g.count('wheel'),
            'markets':g.count('market'),'shuttles':g.count('shuttle')}

def main(n=200):
  strategies=['balanced','transit','wheel_heavy','market_first','passive','random']
  report={'simulations_per_strategy':n,'strategies':{},'all_endings':{},'warnings':[]}
  all_endings=collections.Counter()
  for name in strategies:
    outcomes=[simulate(name,s) for s in range(n)]
    count=collections.Counter(o['ending'] for o in outcomes)
    all_endings.update(count)
    report['strategies'][name]={
      'avg_budget':round(statistics.mean(o['budget'] for o in outcomes),2),
      'avg_debt':round(statistics.mean(o['debt'] for o in outcomes),2),
      'avg_coverage':round(statistics.mean(o['coverage'] for o in outcomes),2),
      'avg_tourism':round(statistics.mean(o['tourism'] for o in outcomes),2),
      'endings':dict(count)
    }
  report['all_endings']=dict(all_endings)
  expected=['一城五輪','預算追加申請中','永遠開不完的協調會','全市愛情接駁網','摩天輪旁的夜市','招商成功，命名失敗','低調完成任務','仍在協商中的愛情城市']
  report['unobserved_endings']=[e for e in expected if e not in all_endings]
  if report['unobserved_endings']:report['warnings'].append('Some endings were not reached by the current limited strategy suite. Do not claim all endings are reachable.')
  if report['strategies']['passive']['avg_coverage']>1:report['warnings'].append('Passive strategy unexpectedly expands coverage.')
  (ROOT/'reports/balance_report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
  print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
