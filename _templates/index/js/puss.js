
function Puss() {
  const sprite = `Sluchaynaya Kotya (c) Aug 2018
0
1       _
2     /#/
3    | |
4     % % _------...   _  _/|
5      % #          ### ##   %
6     _/|     _         .--._.#
7    / ,,%   / ###;,_  ;
8   /,/  |  /    / / #-_#-_
9  /,#    %_#;    %#,   #-_#;  kotya
0
1     -.
2    | |
3     % %
4      % ###------...____ _/|
5      |                 #   %
6       |     _         .--._.#
7      /  .-## ##-._   /#
8      % /      / / #% |
9       %_;    %.#    %_#;     kotya
0
1     -.
2    | |
3     % %
4      % ########-..._____/|
5      |                    %
6      /     ___        .-._.#
7     /  ,/##;  #-.,  /#
8     | /  % %    ||% |
9     %_;   #-#  :/# %_#;      kotya
0
1     .-.
2     | |
3     | %
4      % ########-...___ _/|
5      |                #   %
6     /                 .-._.#
7    /  ,/#%##/###%  /##
8   ; /#    % %_  : |#;
9   %_;      #--#  %_;#        kotya
0
1      ..
2     / /
3     % %
4      % #--#####-...__..__/|
5      /                     %
6     /    /   _        .-.__.#
7   /#  ,/#:#/# #%  /_-/_
8  ; /##   % :   | /  #-_#%
9  %_;      %_#, %_#;    #-#   kotya
0
1 .---.
2  ##% %
3     #.#-_
4      )   ####-_       _/|
5      |         ##--’##   %
6       %   __            _.#
7       |  /  #’---.__  /#
8       % |           %. %_
9        %_#;           #.__#; kotya
0
1  .---.
2 | /#% %
3  %|  | #--_
4   #  /     ##-_
5      %         ##--__/|
6       %   _            %
7       | /# #-.___     _.#
8       : :        #%  #._
9       %_#;          #-.__##; kotya
0
1  /#_#%
2  || % %
3  #/  / ##-,
4     :      #%
5      %       #-_
6       %         ##.-#|
7       ; /#-.          %
8      | :    ##---.  -..#_
9       %_;         #-..___##; kotya
0
1 /#_##%
2 ||  | %
3  #  / ###-,
4    :       %
5     %       %
6      %  %    ##---._/|
7      |  /.            %
8      % |  #-___..   -..#_
9       %_;        ##-.____##; kotya`
  .replace(/#/gm, '`')
  .replace(/%/gm, '\\')
  .split('\n')
  .map(e => e.slice(1, 31) + ' '.repeat(e.length < 31 ? 31 - e.length : 0))
  // alternate
  .map(e => {
    let s = '';
    for (let i in e) {
      const c = e[e.length - 1 - i];
      switch (c) {
      case '\\': s += '/'; break;
      case '/': s += '\\'; break;
      default: s += c;
      }
    }
    return s;
  });
  // returns "walking" and "stretching"
  let offset = 1;
  return [
    [...Array(5)].map(_ => [...sprite.slice(1 + offset, offset += 10)]),
    [...Array(4)].map(_ => [...sprite.slice(1 + offset, offset += 10)])
  ];
}