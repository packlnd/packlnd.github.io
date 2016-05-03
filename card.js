$(function() {
  var LEFT = [122,186,250];
  var SERVER = 'https://shrouded-oasis-42259.herokuapp.com';
  //var SERVER = 'http://localhost:5000';

  if ($("#twitter-card").length) { create_twitter_card(); }
  if ($("#github-card").length) { create_github_card(); }
  if ($("#yelp-card").length) { create_yelp_card(); }
  if ($("#goodreads-card").length) { create_goodreads_card(); }

  function create_goodreads_card() {
    set_loading($("#goodreads-card"));
    var uid = $("#goodreads-card").html();
    $.get({
      url: SERVER + '/goodreads',
      data: {'uid': uid},
      success: function(data) {
        var greads = prepare_obj(
          data['image'],
          data['name'],
          'Last month active: ' + data['active'],
          '#743901',
          false,'','',data['shelves'][0]['count'],format(data['shelves'][0]['name']),
          false,'','',data['shelves'][1]['count'],format(data['shelves'][1]['name']),
          false,'','',data['shelves'][2]['count'],format(data['shelves'][2]['name']),
          0.2,
          'http://packlnd.github.io/goodreads.png'
        );
        draw_card($("#goodreads-card"), greads);
      }
    });
  }

  function format(title) {
    var t = title.split("-").join(" ");
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  function create_yelp_card() {
    var bid = $("#yelp-card").html();
    set_loading($("#yelp-card"));
    $.get({
      url: SERVER + '/yelp',
      data: {'bid': bid},
      success: function(data) {
        var yelp = prepare_obj(
          data['image_url'],
          data['name'],
          data['city'],
          '#c41200',
          false,'','',data['rating'],"Rating",
          false,'','',data['review_count'],"Reviews",
          false,'','',data['verified'],"Verified",
          0.2,
          'http://packlnd.github.io/yelp.png'
        );
        draw_card($("#yelp-card"), yelp);
      }
    });
  }

  function create_twitter_card() {
    var sname = $("#twitter-card").html();
    set_loading($("#twitter-card"));
    $.get({
      url: SERVER + '/twitter',
      data: {'screen_name': sname},
      success: function(data) {
        var twitter = prepare_obj(
          data['profile_image_url'].replace('_normal',''),
          data['name'],
          '@'+data['screen_name'],
          "#"+data['profile_link_color'],
          false,'','',data['statuses_count'],'Tweets',
          false,'','',data['followers_count'],'Followers',
          false,'','',data['friends_count'],'Following',
          0.2,
          'http://packlnd.github.io/twitter.ico'
        );
        draw_card($("#twitter-card"), twitter);
      }
    });
  }

  function create_github_card() {
    uname = $("#github-card").html();
    set_loading($("#github-card"));
    var url = "https://api.github.com/users/" + uname;
    $.getJSON({
      url: url,
      success: function(data) {
        var github = prepare_obj(
          data['avatar_url'],
          data['name'],
          data['login'],
          'rgb(64,120,192)',
          false,'','',data['public_repos'],'Repositories',
          true,SERVER,data['login'],'','Streak',
          false,'','',data['followers'],'Followers',
          0.1,
          'http://packlnd.github.io/github.ico'
        );
        draw_card($("#github-card"), github);
      }
    });
  }

  function draw_card(card, data) {
    card
      .html("")
      //.width(300)
      //.height(100)
      //.css("font-family", "Helvetica, arial, nimbussansl, liberationsans, freesans, clean, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'")
      //.css("background-color", "#EEE")
      //.css("border", "solid 1px #D3D3D3")
      //.css("border-radius", "3px")
      .css("position", "relative")
      .css("z-index", -2)
      .css("padding", 10);
    var img = $("<img />", {src: data['img']})
      .css("position", "absolute")
      .css("top", 10)
      .css("left", 10)
      .css("max-width", 102)
      .css("max-height", 102);
    var name = $("<h2>")
      .css("position", "absolute")
      .html(shorten_if_long(data['name']))
      .css("color", "rgb(51,51,51)")
      .css("margin", 0)
      .css("top", 10)
      .css("left", 122);
    var uname = $("<p>")
      .css("position", "absolute")
      .html(data['uname'])
      .css("top", 38)
      .css("left", 122)
      .css("margin",0)
      .css("font-size","12px")
      .css("color", "#666");
    $.each(data['stats']['items'], function(i,v) {
      if (v['from_server']) {
        fetch_from_server(card, v, data['stats']['color'], i);
      } else {
        color = data['stats']['color'];
        var div = create_stats_div(card, v['number'], v['text'], color, i);
        card.append(div);
      }
    });
    var ico = $("<img/>", {
        src : data['icon']['img']
      })
      .css("position", "absolute")
      .css("top", 5)
      .css("right", 5)
      .css("opacity", data['icon']['opacity'])
      .css("z-index", -1);
    card
      .append(img)
      .append(name)
      .append(uname)
      .append(ico);
  }

  function create_stats_div(card, number, text, color, i) {
    var container = $("<div>")
      .css("top",65)
      .css('left',LEFT[i])
      .width(64)
      .css("position","absolute");
    var num = $("<h3>")
      .html(number)
      .css("color", color)
      .css("text-align", "center")
      .css("margin", "auto 0");
    var txt = $("<p>")
      .html(text)
      .css("margin",0)
      .css("color", "rgb(118,118,118")
      .css("text-align", "center")
      .css("font-size", "10px");
    container
      .append(num)
      .append(txt);
    return container;
  }

  function shorten_if_long(name) {
    if (name.length <= 14)
      return name;
    return name.slice(0,14) + "...";
  }

  function fetch_from_server(card, item, color, i) {
    $.get({
      url: item['url'],
      data: {'uname': item['data']},
      success: function(obj) {
        var div = create_stats_div(card, obj['data'],item['text'], color, i);
        card.append(div);
      }
    });
  }

  function set_loading(card) {
    card
      .html("Loading...")
      .width(300)
      .height(100)
      .css("font-family", "Helvetica, arial, nimbussansl, liberationsans, freesans, clean, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'")
      .css("background-color", "#EEE")
      .css("border", "solid 1px #D3D3D3")
      .css("border-radius", "3px")
  }

  function prepare_obj(
      img,nm,unm,clr,
      fs1,u1,d1,n1,t1,
      fs2,u2,d2,n2,t2,
      fs3,u3,d3,n3,t3,
      io,ii) {
    return {
      'img': img,
      'name': nm,
      'uname': unm,
      'stats': {
        'color': clr,
        'items': [{
          'from_server': fs1,
          'url': u1,
          'data': d1,
          'number': n1,
          'text': t1
        },{
          'from_server': fs2,
          'url': u2,
          'data': d2,
          'number': n2,
          'text': t2
        },{
          'from_server': fs3,
          'url': u3,
          'data': d3,
          'number': n3,
          'text': t3
        }]
      },
      'icon': {
        'opacity': io,
        'img': ii
      }
    };
  }
});
