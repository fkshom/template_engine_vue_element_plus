function dedent(callSite, ...args) {
  function format(str) {
      let size= -1;
      return str.replace(/\n(\s+)/g, (m, m1)=> {
          if (size < 0)
              size= m1.replace(/\t/g, "    ").length;
          return "\n" + m1.slice(Math.min(m1.length, size));
      });
  }
  if (typeof callSite=== "string")
      return format(callSite);
  if (typeof callSite=== "function")
      return (...args)=> format(callSite(...args));
  let output= callSite
      .slice(0, args.length + 1)
      .map((text, i)=> (i=== 0 ? "" : args[i -1]) + text)
      .join("");
  return format(output);
}

const Data = {
  targets: [
    { id: 'a', text: 'teamA', value: '@aa @ab' },
    { id: 'b', text: 'teamB', value: '@ba @bb' },
    { id: 'c', text: 'teamC', value: '@ca @cc' },
  ],
  places: [
    { id: 'place1', text: 'place1' },
    { id: 'place2', text: 'place2' },
  ],
  templates: [
    {
      title: '作業通知1',
      text: dedent`
        {{targets_str}}
        # 作業通知
        {{content}}
        日時：{{date}} {{time}}
        作業場所：{{places_str}}
        作業者：{{username}}
        連作先：{{tel}}
      `.trim(),
      targets: ['a', 'b'],
    },
    {
      title: '作業通知2',
      text: `なし`,
      targets: ['a', 'c'],
    },
  ],
  contents: [
    {
      title: '内容テンプレート1',
      text: dedent`
        下記作業を実施します。
        - 作業1
        - 作業2
        影響範囲：
        - 影響1
        - 影響2
      `.trim(),
    },
    {
      title: '内容テンプレート2',
      text: dedent`
        下記作業を実施します
        - 作業a
        - 作業b
        影響範囲：
        - 影響a
        - 影響b
      `.trim(),
    },
  ],
};
export default Data;
