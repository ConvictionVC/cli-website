const whoisConviction1 = "Conviction is a new venture capital firm, founded on the idea that artificial intelligence and machine learning will be transformative technologies for the next generation of companies and builders. We believe these technologies will have broad, cross-industry impact, and we are excited to work with founders at every layer of the stack, from chips and research labs to AI-native applications.";
const whoisConviction2 = "We want to build a firm that is hands-on, deep in our domain, long-term in our orientation, and committed to community. To that end, we're lucky to count the founders, CEOs, or COOs of Amplitude, Anchorage, Benchling, Coda, Coinbase, Deepmind, Dropbox, Duo, Hubspot, Figma, Front, Gusto, Instacart, Mongo, Notion, Okta, Rippling, Rubrik, Shopify, Stripe, Workday, Zillow, Zoom and other pioneering tech companies as LPs. We're excited to work with the next founders who will build companies to join their ranks.";
const whoisCommit1 = "Commit is a community program for young builders who want to work on new things in AI. Openminded, force-of-nature young people are some of the most powerful forces in the world. We want to enable them with a just-as-powerful network.";
const whoisCommit2 = "Though cohorts are onboarded annually, we are building a lifelong network of AI innovators, with mentorship from the Conviction team, the Conviction family of companies and Conviction alums. Use %apply% to join us!";
const timeUnit = 10; // useful for development, set to 10 to run faster, set to 1000 for production
let killed = false;

const commands = {
  help: function() {
    const maxCmdLength = Math.max(...Object.keys(help).map(x => x.length));
    Object.entries(help).forEach(function(kv) {
      const cmd = kv[0];
      const desc = kv[1];
      if (term.cols >= 80) {
        const rightPad = maxCmdLength - cmd.length + 2;
        const sep = " ".repeat(rightPad);
        term.stylePrint(`${cmd}${sep}${desc}`);
      } else {
        if (cmd != 'help') { // skip second leading newline
          term.writeln("");
        }
        term.stylePrint(cmd);
        term.stylePrint(desc);
      }
    })
  },

  whois: function(args) {
    const name = args[0];
    const people = Object.keys(team);

    if (!name) {
      term.stylePrint("%whois%: Learn about the firm, or a partner - usage:\r\n");
      term.stylePrint("%whois% conviction");
      for (p of people) {
        term.stylePrint(`%whois% ${p}`);
      }
    } else if (name == "conviction") {
      term.stylePrint(whoisConviction1);
      term.stylePrint("\r\n");
      term.stylePrint(whoisConviction2);
    } else if (Object.keys(team).includes(name)) {
      const person = team[name];
      term.stylePrint(`\r\n${person["name"]}, ${person["title"]} - ${name}@conviction.com`);
      term.stylePrint(`${person["twitter"]}\r\n`);
      term.stylePrint(person["description"]);
    } else {
      term.stylePrint(`User ${name || ''} not found. Try:\r\n`);
      term.stylePrint("%whois% conviction");
      for (p of people) {
        term.stylePrint(`%whois% ${p}`);
      }
    }
  },

  sponsors: function() {
    term.stylePrint("Huge thank you to our sponsors!\r\n");

    for (s of Object.values(sponsors)) {
      term.stylePrint(`${s["name"]} - ${s["link"]}`);
    }
  },

  hackathon: function(args) {
    const name = args[0];
    const teams = Object.keys(hackathon);

    if (!name) {
      term.stylePrint("%hackathon%: Learn about a hackathon project:\r\n");
      for (p of teams) {
        term.stylePrint(`%hackathon% ${p}`);
      }
    } else if (Object.keys(hackathon).includes(name)) {
      const team = hackathon[name];
      term.stylePrint(`\r\n${team["description"]}`);
      term.stylePrint(`\r\nTeam members:`);
      for (member of team["team"]) {
        term.stylePrint(`   ${member["name"]}, ${member["link"]}`);
      }
      term.stylePrint(`${team["link"]}`);
    } else {
      term.stylePrint(`User ${name || ''} not found. Try:\r\n`);
      for (p of teams) {
        term.stylePrint(`%hackathon% ${p}`);
      }
    }
  },

  commit: function() {
    term.stylePrint(whoisCommit1);
    term.stylePrint("\r\n");
    term.stylePrint(whoisCommit2);
  },


  test: function() {
    term.openURL("https://gfycat.com/ifr/WhiteBountifulAfricangroundhornbill");
  },

  email: function() {
    term.command("pine");
  },

  twitter: function() {
    term.displayURL("https://twitter.com/w_conviction");
    term.displayURL("https://twitter.com/saranormous");
    term.displayURL("https://twitter.com/prnvrdy");
  },

  echo: function(args) {
    const message = args.join(" ");
    term.stylePrint(message);
  },

  say: function(args) {
    const message = args.join(" ");
    term.stylePrint(`(Robot voice): ${message}`);
  },

  pwd: function() {
    term.stylePrint("/" + term.cwd.replaceAll("~", `home/${term.user}`));
  },

  ls: function() {
    term.stylePrint(_filesHere().join("   "));
  },

  // I am so, so sorry for this code.
  cd: function(args) {
    let dir = args[0] || "~";
    if (dir != "/") {
      // strip trailing slash
      dir = dir.replace(/\/$/, "");
    }

    switch (dir) {
      case "~":
        term.cwd = "~";
        break;
      case "..":
        if (term.cwd == "~") {
          term.command("cd /home");
        } else if (["home", "bin"].includes(term.cwd)) {
          term.command("cd /");
        }
        break;
      case "../..":
      case "../../..":
      case "../../../..":
      case "/":
        term.cwd = "/";
        break;
      case "home":
        if (term.cwd == "/") {
          term.command("cd /home");
        } else {
          term.stylePrint(`You do not have permission to access this directory`);
        }
        break;
      case "/home":
        term.cwd = "home";
        break;
      case "/bin":
        term.cwd = "bin";
        break;
      case "bin":
        if (term.cwd == "/") {
          term.cwd = "bin";
        } else {
          term.stylePrint(`No such directory: ${dir}`);
        }
        break;
      case ".":
        break;
      default:
        term.stylePrint(`No such directory: ${dir}`);
        break;
    }
  },

  zsh: function() {
    term.init(term.user);
  },

  cat: function(args) {
    const filename = args[0];

    if (_filesHere().includes(filename)) {
      term.writeln(getFileContents(filename));
    } else {
      term.stylePrint(`No such file: ${filename}`);
    }
    if (filename == "id_rsa") {
      term.openURL("https://gfycat.com/ifr/WhiteBountifulAfricangroundhornbill");
    }
  },

  grep: function(args) {
    const q = args[0];
    const filename = args[1];

    if (filename == "id_rsa") {
      term.openURL("https://gfycat.com/ifr/WhiteBountifulAfricangroundhornbill");
    }

    if (!q || !filename) {
      term.stylePrint("usage: %grep% [pattern] [filename]");
      return;
    }

    if (_filesHere().includes(filename)) {
      var file = getFileContents(filename);
      const matches = file.matchAll(q);
      for (match of matches) {
        file = file.replaceAll(match[0], colorText(match[0], "files"));
      }
      term.writeln(file);
    } else {
      term.stylePrint(`No such file or directory: ${filename}`);
    }
  },

  gzip: function() {
    term.stylePrint("What are you going to do with a zip file on a fake terminal, seriously?");
  },

  free: function() {
    term.stylePrint("Honestly, our memory isn't what it used to be.");
  },

  tail: function(args) {
    term.command(`cat ${args.join(" ")}`);
  },

  less: function(args) {
    term.command(`cat ${args.join(" ")}`);
  },

  head: function(args) {
    term.command(`cat ${args.join(" ")}`);
  },

  open: function(args) {
    if (!args.length) {
      term.stylePrint("%open%: open a file - usage:\r\n");
      term.stylePrint("%open% test.htm");
    } else if (args[0].split(".")[0] == "test" && args[0].split(".")[1] == "htm") {
      term.openURL("https://gfycat.com/ifr/WhiteBountifulAfricangroundhornbill");
    } else if (args[0].split(".")[1] == "htm") {
      term.openURL(`./${args[0]}`, false);
    } else if (args.join(" ") == "the pod bay doors") {
      term.stylePrint("I'm sorry Dave, I'm afraid I can't do that.");
    } else {
      term.command(`cat ${args.join(" ")}`);
    }
  },

  more: function(args) {
    term.command(`cat ${args.join(" ")}`);
  },

  emacs: function() {
    term.stylePrint("%emacs% not installed. try: %vi%");
  },

  vim: function() {
    term.stylePrint("%vim% not installed. try: %emacs%");
  },

  vi: function() {
    term.stylePrint("%vi% not installed. try: %emacs%");
  },

  pico: function() {
    term.stylePrint("%pico% not installed. try: %vi% or %emacs%");
  },

  nano: function() {
    term.stylePrint("%nano% not installed. try: %vi% or %emacs%");
  },

  pine: function() {
    term.openURL("mailto:commit@conviction.com");
  },

  curl: function(args) {
    term.stylePrint(`Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource ${args[0]}.`);
  },

  ftp: function(args) {
    term.command(`curl ${args.join(" ")}`);
  },

  ssh: function(args) {
    term.command(`curl ${args.join(" ")}`);
  },

  sftp: function(args) {
    term.command(`curl ${args.join(" ")}`);
  },

  scp: function(args) {
    term.stylePrint(`████████████ Request Blocked: The ███████████ Policy disallows reading the ██████ resource ${args[0]}.`);
  },

  rm: function() {
    term.stylePrint("I'm sorry Dave, I'm afraid I can't do that.");
  },

  mkdir: function() {
    term.stylePrint("Come on, don't mess with our immaculate file system.");
  },

  alias: function() {
    term.stylePrint("Just call me HAL.");
  },


  kill: function(args) {
    term.stylePrint("You can't kill me!");
  },

  killall: function(args) {
    term.command(`kill ${args.join(" ")}`);
  },

  locate: function() {
    term.stylePrint("Conviction Partners");
    term.stylePrint("660 York St");
    term.stylePrint("San Francisco, CA 94110");
  },

  history: function() {
    term.history.forEach((element, index) => {
      term.stylePrint(`${1000 + index}  ${element}`);
    })
  },

  find: function(args) {
    const file = args[0];
    if (Object.keys(_FILES).includes(file)) {
      term.stylePrint(_FULL_PATHS[file]);
    } else {
      term.stylePrint(`%find%: ${file}: No such file or directory`);
    }
  },

  fdisk: function() {
    term.command("rm");
  },

  chown: function() {
    term.stylePrint("You do not have permission to %chown%");
  },

  chmod: function() {
    term.stylePrint("You do not have permission to %chmod%");
  },

  mv: function(args) {
    const src = args[0];

    if (_filesHere().includes(src)) {
      term.stylePrint(`You do not have permission to move file ${src}`);
    } else {
      term.stylePrint(`%mv%: ${src}: No such file or directory`);
    }
  },

  cp: function(args) {
    const src = args[0];

    if (_filesHere().includes(src)) {
      term.stylePrint(`You do not have permission to copy file ${src}`);
    } else {
      term.stylePrint(`%cp%: ${src}: No such file or directory`);
    }
  },

  touch: function() {
    term.stylePrint("You can't %touch% this");
  },

  sudo: function(args) {
    if (term.user == "conviction") {
      term.command(args.join(" "));
    }
    else {
      term.stylePrint(`${colorText(term.user, "user")} is not in the sudoers file. This incident will be reported`);
    }
  },

  su: function(args) {
    user = args[0] || "conviction";

    if (user == "conviction" || user == "guest") {
      term.user = user;
      term.command("cd ~");
    } else {
      term.stylePrint("su: Sorry");
    }
  },

  quit: function() {
    term.command("exit");
  },

  stop: function() {
    term.command("exit");
  },

  whoami: function() {
    term.stylePrint(term.user);
  },

  passwd: function() {
    term.stylePrint("Wow. Maybe don't enter your password into a sketchy web-based term.command prompt?");
  },

  ping: function() {
    term.stylePrint("pong");
  },

  ps: function() {
    term.stylePrint("PID TTY       TIME CMD");
    term.stylePrint("424 ttys00 0:00.33 %-zsh%");
    term.stylePrint("158 ttys01 0:09.70 %/bin/npm start%");
    term.stylePrint("767 ttys02 0:00.02 %/bin/sh%");
    if (!killed) {
      term.stylePrint("337 ttys03 0:13.37 %/bin/cgminer -o pwn.d%");
    }
  },

  uname: function(args) {
    switch (args[0]) {
      case "-a":
        term.stylePrint("CnvctnVC cnvctn 0.0.1 CnvctnVC Kernel Version 0.0.1 root:xnu-31415.926.5~3/RELEASE_X86_64 x86_64");
        break;
      case "-mrs":
        term.stylePrint("CnvctnVC 0.0.1 x86_64");
        break;
      default:
        term.stylePrint("CnvctnVC");
    }
  },

  top: function() {
    term.command("ps");
  },

  exit: function() {
    term.command("open welcome.htm");
  },

  clear: function() {
    term.init();
  },

  zed: function() {
    term.stylePrint("Coming soon! ;)");
  },

  ge: function() {
    term.command("great_expectations");
  },

  great_expectations: function() {
    term.command("superconductive");
  },

  privacy: function() {
    term.command("privacy_dynamics");
  },

  ln: function() {
    term.command("alan");
  },

  anycloud: function() {
    term.stylePrint("https://docs.anycloudapp.com/documentation/tutorials/aws-node");
  },

  eval: function(args) {
    term.stylePrint("please instead build a webstore with macros. in the meantime, the result is: " + eval(args.join(" ")));
  },

  bg: function(args) {
    term.stylePrint(`Sorry. If you want to background one of these jobs, you'll need to help us fill it. Try %fg% ${args} instead.`);
  },

  fg: function(args) {
    const job = jobs[args];

    if (job) {
      job.map(line => term.stylePrint(line));
      term.stylePrint(`\r\n%apply% ${args} to apply!`);
    } else {
      term.stylePrint(`job id ${args} not found.`);
    }
  },

  apply: function(args) {
    term.stylePrint("Applications have closed for Commit 2023! Please reach out at commit@conviction.com if you feel strongly about your application :)");
  }
}

function _filesHere() {
  return _DIRS[term.cwd].filter((e) => e != 'README.md' || term.user == "conviction");
}
