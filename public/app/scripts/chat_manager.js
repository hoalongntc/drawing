ChatManager = new function () {
    var self = this;

    var mainContainer = document.getElementById('container');
    var messagesWrapper = document.getElementById('messages-wrapper');
    var messageInputWrapper = document.getElementById('message-input');
    var messageToggle = document.getElementById('message-toggle');
    var messageSend = document.getElementById('message-send');
    var messageText = document.getElementById('message-text');
    var messagesTab = document.getElementById('tab-messages');
    var notificationsTab = document.getElementById('tab-notifications');
    var notificationsWrapper = document.getElementById('notifications-wrapper');
    var stickerSets = document.getElementById('sticker-sets');
    var stickersContainer = document.getElementById('stickers-container');
    var stickerToggle = document.getElementById('sticker-toggle');
    var membersWrapper = document.getElementById('members-wrapper');
    var startSharingButton = document.getElementById('start-sharing');
    var stopSharingButton = document.getElementById('stop-sharing');
    var friendInfoContainer = document.getElementById('friend-info-container');
    var friendInfoText = document.getElementById('friend-info-text');
    var friendInfoAddFriend = document.getElementById('friend-info-add-friend');
    var friendInfoCancel = document.getElementById('friend-info-cancel');
    var friendInfoAccept = document.getElementById('friend-info-accept');
    var friendInfoReject = document.getElementById('friend-info-reject');
    var friendInfoUnFriend = document.getElementById('friend-info-un-friend');
    var moreFriendButton = document.getElementById('more-friend');
    var memberSearchInputWrapper = document.getElementById('member-search');
    var searchResultWrapper = document.getElementById('members-search-wrapper');
    var memberSearchText = document.getElementById('member-search-text');
    var memberSearchSend = document.getElementById('member-search-send');
    var hideMessagesBtn = document.getElementById('hide-messages');

    var maxMessage = 100;
    var maxShowOlderMessage = 15;

    var linkRegex = /(https?:\/\/[^\s]+)/g;
    var sharedKeyRegex = /^\[\[[0-9A-F]{8}\]\]$/;
    var emoticons = [
        { regex: /:\)\)/g, image: '126362014215262' }, // :))
        { regex: /=\)\)/g, image: '126362140881916' }, // =))
        { regex: /:\(\(/g, image: '126361977548599', title: 'Crying' }, // :((

        { regex: /\^[_.]\^/g, image: '126362120881918', title: 'Happy' }, // ^_^ ^.^
        { regex: /\*[_.]\*/g, image: '126361997548597', title: 'Very happy' }, // *_* *.*
        { regex: /\@[_.]@/g, image: '126361887548608', title: '' }, // @_@ @.@

        { regex: /O:[-=]*\)/gi, image: '126362200881910', title: 'Angel' }, // O:-) O:=) o:-) o:=) O:) o:)
        { regex: /:[-=]*P/gi, image: '126362127548584', title: 'Cheeky' }, // :-P :=P :-p :=p :P :p
        { regex: /:[-=]*O/gi, image: '126361914215272', title: 'Surprised' }, // :-O :=O :-o :-o :O :o
        { regex: /:[-=]*D/gi, image: '126361970881933', title: 'Laugh' }, // :-D :=D :-d :=d :D :d
        { regex: /:[-=]*S/gi, image: '126362067548590', title: 'Worried' }, // :-S :=S :-s :=s :S :s
        { regex: /[B8][-=]*\)/gi, image: '126362214215242', title: 'Cool' }, // B-) B=) b-) b=) 8-) 8=) B) b) 8)
        { regex: /:[-=]*\?/gi, image: '126362170881913', title: 'Thinking' }, // :-? :=? :?
        { regex: /\[[-=]\(/gi, image: '126362234215240' }, // [-( [=(
        { regex: /:[-=]*\)/g, image: '126361877548609', title: 'Smile' }, // :-) :=) :)
        { regex: /;[-=]*\)/g, image: '126362164215247', title: 'Wink' }, // ;-) ;=) ;)
        { regex: /;[-=]*\(/g, image: '126361977548599', title: 'Crying' }, // ;-( ;=( ;( alias for :((
        { regex: /:[-=]*\(/g, image: '126362084215255', title: 'Sad' }, // :-( :=( :(
        { regex: /:[-=]*\|/g, image: '126361960881934', title: 'Speechless' }, // :-| :=| :|

        { regex: /:">/g, image: '126362184215245', title: 'Blush' }, // :">
        { regex: /:[-=]*\$/g, image: '126362184215245', title: 'Blush' } // :-$ :=$ :$ alias for :">
    ];
    var stickers = {
        'Pusheen': {
            default: 1,
            image: '279586385548961',
            stickers: {
                //1
                '279586385548960': {
                    'image': '279586385548960', 'delay': 200,
                    'positions': [ '-5px -5px', '-67px -5px', '-5px -79px', '-67px -79px' ],
                    'positionsL': [ '-9px -9px', '-125px -9px', '-9px -147px', '-125px -147px' ]
                },
                '279586372215628': {
                    'image': '279586372215628', 'delay': 200,
                    'positions': [ '-5px -5px', '-79px -5px', '-5px -74px', '-79px -74px' ],
                    'positionsL': [ '-11px -11px', '-153px -11px', '-11px -145px', '-153px -145px' ]
                },
                '279586365548962': {
                    'image': '279586365548962', 'delay': 200,
                    'positions': [ '-5px -5px', '-74px -5px', '-5px -79px', '-74px -79px' ],
                    'positionsL': [ '-11px -11px', '-144px -11px', '-11px -153px', '-144px -153px' ]
                },
                '279586362215629': {
                    'image': '279586362215629', 'delay': 200,
                    'positions': [ '-6px -6px', '-80px -6px', '-6px -82px', '-80px -82px' ],
                    'positionsL': [ '-11px -11px', '-148px -11px', '-11px -153px', '-148px -153px' ]
                },
                //5
                '279586332215632': {
                    'image': '279586332215632', 'delay': 200,
                    'positions': [ '-5px -5px', '-73px -5px', '-5px -79px', '-73px -79px' ],
                    'positionsL': [ '-10px -10px', '-138px -10px', '-10px -150px', '-138px -150px' ]
                },
                '279586392215626': {
                    'image': '279586392215626', 'delay': 200,
                    'positions': [ '-4px -4px', '-60px -4px', '-4px -76px', '-60px -76px' ],
                    'positionsL': [ '-8px -8px', '-113px -8px', '-8px -144px', '-113px -144px' ]
                },
                '279586305548968': {
                    'image': '279586305548968', 'delay': 200,
                    'positions': [ '-5px -5px', '-71px -5px', '-5px -79px', '-71px -79px' ],
                    'positionsL': [ '-10px -10px', '-135px -10px', '-10px -150px', '-135px -150px' ]
                },
                '279586282215637': {
                    'image': '279586282215637', 'delay': 200,
                    'positions': [ '-4px -5px', '-71px -5px', '-4px -79px', '-71px -79px' ],
                    'positionsL': [ '-10px -10px', '-137px -10px', '-10px -150px', '-137px -150px' ]
                },
                //9
                '279586338882298': {
                    'image': '279586338882298', 'delay': 200,
                    'positions': [ '-5px -5px', '-68px -5px', '-5px -79px', '-68px -79px' ],
                    'positionsL': [ '-9px -9px', '-125px -9px', '-9px -147px', '-125px -147px' ]
                },
                '279586322215633': {
                    'image': '279586322215633', 'delay': 200,
                    'positions': [ '-6px -6px', '-82px -6px', '-6px -81px', '-82px -81px' ],
                    'positionsL': [ '-11px -11px', '-153px -11px', '-11px -152px', '-153px -152px' ]
                },
                '279586295548969': {
                    'image': '279586295548969', 'delay': 120,
                    'positions': [ '-6px -6px', '-82px -6px', '-158px -6px', '-6px -79px', '-82px -79px', '-158px -79px', '-6px -152px', '-82px -152px' ],
                    'positionsL': [ '-11px -11px', '-153px -11px', '-295px -11px', '-11px -148px', '-153px -148px', '-295px -148px', '-11px -285px', '-153px -285px' ]
                },
                '279586275548971': {
                    'image': '279586275548971', 'delay': 150,
                    'positions': [ '-5px -5px', '-67px -5px', '-129px -5px', '-5px -79px', '-67px -79px', '-129px -79px', '-5px -153px', '-67px -153px' ],
                    'positionsL': [ '-9px -9px', '-124px -9px', '-239px -9px', '-9px -147px', '-124px -147px', '-239px -147px', '-9px -285px', '-124px -285px' ]
                },
                //13
                '279586255548973': {
                    'image': '279586255548973', 'delay': 200,
                    'positions': [ '-5px -5px', '-79px -5px', '-5px -71px', '-79px -71px' ],
                    'positionsL': [ '-10px -10px', '-150px -10px', '-10px -135px', '-150px -135px' ]
                },
                '279586285548970': {
                    'image': '279586285548970', 'delay': 200,
                    'positions': [ '-4px -4px', '-59px -4px', '-4px -76px', '-59px -76px' ],
                    'positionsL': [ '-8px -8px', '-112px -8px', '-8px -144px', '-112px -144px' ]
                },
                '279586368882295': {
                    'image': '279586368882295', 'delay': 200,
                    'positions': [ '-6px -6px', '-79px -6px', '-6px -82px', '-79px -82px' ],
                    'positionsL': [ '-11px -11px', '-147px -11px', '-11px -153px', '-147px -153px' ]
                },
                '279586388882293': {
                    'image': '279586388882293', 'delay': 200,
                    'positions': [ '-6px -6px', '-80px -6px', '-6px -82px', '-80px -82px' ],
                    'positionsL': [ '-11px -11px', '-148px -11px', '-11px -153px', '-148px -153px' ]
                },
                //17
                '279586375548961': {
                    'image': '279586375548961', 'delay': 200,
                    'positions': [ '-5px -5px', '-79px -5px', '-5px -72px', '-79px -72px' ],
                    'positionsL': [ '-10px -10px', '-150px -10px', '-10px -138px', '-150px -138px' ]
                },
                '279586345548964': {
                    'image': '279586345548964', 'delay': 200,
                    'positions': [ '-5px -5px', '-79px -5px', '-5px -66px', '-79px -66px' ],
                    'positionsL': [ '-9px -9px', '-147px -9px', '-9px -122px', '-147px -122px' ]
                },
                '279586325548966': {
                    'image': '279586325548966', 'delay': 200,
                    'positions': [ '-5px -5px', '-79px -5px', '-5px -69px', '-79px -69px' ],
                    'positionsL': [ '-10px -10px', '-150px -10px', '-10px -132px', '-150px -132px' ]
                },
                '279586342215631': {
                    'image': '279586342215631', 'delay': 200,
                    'positions': [ '-5px -5px', '-79px -5px', '-5px -65px', '-79px -65px' ],
                    'positionsL': [ '-9px -9px', '-148px -9px', '-9px -122px', '-148px -122px' ]
                },
                //21
                '279586378882294': {
                    'image': '279586378882294', 'delay': 200,
                    'positions': [ '-5px -5px', '-79px -5px', '-153px -5px', '-5px -65px', '-79px -65px', '-153px -65px', '-5px -125px' ],
                    'positionsL': [ '-9px -9px', '-147px -9px', '-285px -9px', '-9px -122px', '-147px -122px', '-285px -122px', '-9px -235px' ]
                },
                '279586302215635': {
                    'image': '279586302215635', 'delay': 200,
                    'positions': [ '-5px -5px', '-79px -5px', '-5px -66px', '-79px -66px' ],
                    'positionsL': [ '-9px -9px', '-147px -9px', '-9px -123px', '-147px -123px' ]
                },
                '279586292215636': {
                    'image': '279586292215636', 'delay': 200,
                    'positions': [ '-5px -5px', '-79px -5px', '-5px -68px', '-79px -68px' ],
                    'positionsL': [ '-10px -10px', '-150px -10px', '-10px -131px', '-150px -131px' ]
                },
                '279586288882303': {
                    'image': '279586288882303', 'delay': 200,
                    'positions': [ '-5px -5px', '-79px -5px', '-5px -65px', '-79px -65px' ],
                    'positionsL': [ '-9px -9px', '-147px -9px', '-9px -120px', '-147px -120px' ]
                },
                //25
                '279586358882296': {
                    'image': '279586358882296', 'delay': 200,
                    'positions': [ '-4px -4px', '-76px -4px', '-4px -52px', '-76px -52px' ],
                    'positionsL': [ '-7px -7px', '-141px -7px', '-7px -96px', '-141px -96px' ]
                },
                '279586328882299': {
                    'image': '279586328882299', 'delay': 200,
                    'positions': [ '-4px -4px', '-76px -4px', '-4px -53px', '-76px -53px' ],
                    'positionsL': [ '-7px -7px', '-141px -7px', '-7px -99px', '-141px -99px' ]
                },
                '279586315548967': {
                    'image': '279586315548967', 'delay': 200,
                    'positions': [ '-3px -3px', '-73px -3px', '-3px -48px', '-73px -48px' ],
                    'positionsL': [ '-7px -7px', '-141px -7px', '-7px -95px', '-141px -95px' ]
                },
                '279586262215639': {
                    'image': '279586262215639', 'delay': 200,
                    'positions': [ '-3px -3px', '-73px -3px', '-3px -48px', '-73px -48px' ],
                    'positionsL': [ '-7px -7px', '-141px -7px', '-7px -94px', '-141px -94px' ]
                },
                //29
                '279586312215634': {
                    'image': '279586312215634', 'delay': 200,
                    'positions': [ '-4px -4px', '-76px -4px', '-4px -52px', '-76px -52px' ],
                    'positionsL': [ '-7px -7px', '-141px -7px', '-7px -97px', '-141px -97px' ]
                },
                '279586272215638': {
                    'image': '279586272215638', 'delay': 200,
                    'positions': [ '-3px -3px', '-73px -3px', '-3px -46px', '-73px -46px' ],
                    'positionsL': [ '-7px -7px', '-141px -7px', '-7px -92px', '-141px -92px' ]
                },
                '279586355548963': {
                    'image': '279586355548963', 'delay': 200,
                    'positions': [ '-4px -4px', '-76px -4px', '-4px -52px', '-76px -52px' ],
                    'positionsL': [ '-7px -7px', '-141px -7px', '-7px -97px', '-141px -97px' ]
                },
                '279586318882300': {
                    'image': '279586318882300', 'delay': 200,
                    'positions': [ '-3px -3px', '-73px -3px', '-3px -43px', '-73px -43px' ],
                    'positionsL': [ '-6px -6px', '-138px -6px', '-6px -82px', '-138px -82px' ]
                },
                //33
                '279586382215627': {
                    'image': '279586382215627', 'delay': 200,
                    'positions': [ '-3px -3px', '-73px -3px', '-3px -48px', '-73px -48px' ],
                    'positionsL': [ '-7px -7px', '-141px -7px', '-7px -95px', '-141px -95px' ]
                },
                '279586348882297': {
                    'image': '279586348882297', 'delay': 200,
                    'positions': [ '-4px -4px', '-76px -4px', '-4px -54px', '-76px -54px' ],
                    'positionsL': [ '-7px -7px', '-141px -7px', '-7px -100px', '-141px -100px' ]
                },
                '279586335548965': {
                    'image': '279586335548965', 'delay': 200,
                    'positions': [ '-3px -3px', '-73px -3px', '-3px -43px', '-73px -43px' ],
                    'positionsL': [ '-6px -6px', '-138px -6px', '-6px -82px', '-138px -82px' ]
                },
                '279586258882306': {
                    'image': '279586258882306', 'delay': 200,
                    'positions': [ '-4px -4px', '-76px -4px', '-4px -56px', '-76px -56px' ],
                    'positionsL': [ '-8px -8px', '-144px -8px', '-8px -107px', '-144px -107px' ]
                },
                //37
                '279586352215630': {
                    'image': '279586352215630', 'delay': 200,
                    'positions': [ '-4px -4px', '-76px -4px', '-4px -58px', '-76px -58px' ],
                    'positionsL': [ '-8px -8px', '-144px -8px', '-8px -111px', '-144px -111px' ]
                },
                '279586308882301': {
                    'image': '279586308882301', 'delay': 200,
                    'positions': [ '-4px -4px', '-76px -4px', '-4px -58px', '-76px -58px' ],
                    'positionsL': [ '-8px -8px', '-144px -8px', '-8px -111px', '-144px -111px' ]
                },
                '279586278882304': {
                    'image': '279586278882304', 'delay': 200,
                    'positions': [ '-4px -4px', '-76px -4px', '-4px -52px', '-76px -52px' ],
                    'positionsL': [ '-7px -7px', '-141px -7px', '-7px -96px', '-141px -96px' ]
                },
                '279586298882302': {
                    'image': '279586298882302', 'delay': 200,
                    'positions': [ '-4px -4px', '-76px -4px', '-4px -59px', '-76px -59px' ],
                    'positionsL': [ '-8px -8px', '-144px -8px', '-8px -113px', '-144px -113px' ]
                }
            }
        },

        'Koko' : {
            image: '499671210115382',
            stickers: {
                '499671063448730': {
                    'image': '499671063448730'
                },
                '499671103448726': {
                    'image': '499671103448726'
                },
                '499670973448739': {
                    'image': '499670973448739'
                },
                '499670946782075': {
                    'image': '499670946782075'
                },
                '499671050115398': {
                    'image': '499671050115398'
                },
                '499671006782069': {
                    'image': '499671006782069'
                },
                '499671090115394': {
                    'image': '499671090115394'
                },
                '499671210115382': {
                    'image': '499671210115382'
                },
                '499670980115405': {
                    'image': '499670980115405'
                },
                '499671136782056': {
                    'image': '499671136782056'
                },
                '499671143448722': {
                    'image': '499671143448722'
                },
                '499671170115386': {
                    'image': '499671170115386'
                },
                '499671076782062': {
                    'image': '499671076782062'
                },
                '499671000115403': {
                    'image': '499671000115403'
                },
                '499671116782058': {
                    'image': '499671116782058'
                },
                '499670940115409': {
                    'image': '499670940115409'
                },
                '499671156782054': {
                    'image': '499671156782054'
                },
                '499671020115401': {
                    'image': '499671020115401'
                },
                '499671026782067': {
                    'image': '499671026782067'
                },
                '499671043448732': {
                    'image': '499671043448732'
                },
                '499671190115384': {
                    'image': '499671190115384'
                },
                '499671183448718': {
                    'image': '499671183448718'
                },
                '499671013448735': {
                    'image': '499671013448735'
                },
                '499671123448724': {
                    'image': '499671123448724'
                },
                '499671096782060': {
                    'image': '499671096782060'
                },
                '499671083448728': {
                    'image': '499671083448728'
                },
                '499671243448712': {
                    'image': '499671243448712'
                },
                '499671110115392': {
                    'image': '499671110115392'
                },
                '499670960115407': {
                    'image': '499670960115407'
                },
                '499670966782073': {
                    'image': '499670966782073'
                },
                '499671203448716': {
                    'image': '499671203448716'
                },
                '499671163448720': {
                    'image': '499671163448720'
                },
                '499671216782048': {
                    'image': '499671216782048'
                },
                '499671033448733': {
                    'image': '499671033448733'
                },
                '499671226782047': {
                    'image': '499671226782047'
                },
                '499671056782064': {
                    'image': '499671056782064'
                },
                '499671233448713': {
                    'image': '499671233448713'
                },
                '499671130115390': {
                    'image': '499671130115390'
                },
                '499670953448741': {
                    'image': '499670953448741'
                },
                '499671176782052': {
                    'image': '499671176782052'
                },
                '499671196782050': {
                    'image': '499671196782050'
                },
                '499671070115396': {
                    'image': '499671070115396'
                },
                '499670990115404': {
                    'image': '499670990115404'
                },
                '499671150115388': {
                    'image': '499671150115388'
                }
            }
        }
    };

    function __parseStr(jsonStr) {
        return JSON.parse(jsonStr);
    }
    function hideAll() {
        hideAllSharing();
        mainContainer.classList.remove('show-members');
        mainContainer.classList.remove('show-messages');
    }
    function showMembers() {
        mainContainer.classList.add('show-members');
        mainContainer.classList.remove('show-messages');
    }
    function showMessages() {
        mainContainer.classList.add('show-messages');
        mainContainer.classList.remove('show-members');
    }
    function showTabMessage() {
        showMessages();
        mainContainer.classList.add('show-tab-messages');
        mainContainer.classList.remove('show-tab-notifications');
        mainContainer.classList.remove('show-tab-search');
        hideHasNewMessage();
    }
    function showTabNotifications() {
        showMessages();
        mainContainer.classList.remove('show-tab-messages');
        mainContainer.classList.add('show-tab-notifications');
        mainContainer.classList.remove('show-tab-search');
        hideHasNewNotification();
    }
    function showTabSearch() {
        showMessages();
        mainContainer.classList.remove('show-tab-messages');
        mainContainer.classList.remove('show-tab-notifications');
        mainContainer.classList.add('show-tab-search');
        lastChatWith.classList.remove('active');
        lastChatWith = null;
    }
    function isShowingMessages() {
        return mainContainer.classList.contains('show-messages');
    }
    function isShowingTabMessage() {
        return mainContainer.classList.contains('show-tab-messages');
    }
    function isShowingTabNotification() {
        return mainContainer.classList.contains('show-tab-notifications');
    }
    function isShowingTabSearch() {
        return mainContainer.classList.contains('show-tab-search');
    }
    function showHasNewMessage() {
        if(isShowingTabNotification()) messagesTab.classList.add('new-message');
    }
    function showHasNewNotification() {
        if(isShowingTabMessage()) notificationsTab.classList.add('new-message');
    }
    function hideHasNewMessage() {
        messagesTab.classList.remove('new-message');
    }
    function hideHasNewNotification() {
        notificationsTab.classList.remove('new-message');
    }

    function showIsSharing() {
        mainContainer.classList.add('is-sharing');
        mainContainer.classList.remove('is-not-sharing');
    }
    function showIsNotSharing() {
        mainContainer.classList.remove('is-sharing');
        mainContainer.classList.add('is-not-sharing');
    }
    function hideAllSharing() {
        mainContainer.classList.remove('is-sharing');
        mainContainer.classList.remove('is-not-sharing');
    }

    function hideFriendStatus() {
        friendInfoContainer.classList.remove('friend');
        friendInfoContainer.classList.remove('not-friend');
        friendInfoContainer.classList.remove('wait');
        friendInfoContainer.classList.remove('reply');
    }
    function showIsFriend() {
        friendInfoContainer.classList.add('friend');
        friendInfoContainer.classList.remove('not-friend');
        friendInfoContainer.classList.remove('wait');
        friendInfoContainer.classList.remove('reply');
    }
    function showNotFriend() {
        friendInfoContainer.classList.remove('friend');
        friendInfoContainer.classList.add('not-friend');
        friendInfoContainer.classList.remove('wait');
        friendInfoContainer.classList.remove('reply');
    }
    function showWaiting() {
        friendInfoContainer.classList.remove('friend');
        friendInfoContainer.classList.remove('not-friend');
        friendInfoContainer.classList.add('wait');
        friendInfoContainer.classList.remove('reply');
    }
    function showNeedReply() {
        friendInfoContainer.classList.remove('friend');
        friendInfoContainer.classList.remove('not-friend');
        friendInfoContainer.classList.remove('wait');
        friendInfoContainer.classList.add('reply');
    }

    messageText.addEventListener('change', function (e) {
        if (!e.currentTarget.value) return;
        addMessage(e.currentTarget.value);
        e.currentTarget.value = null;
        messageSend.disabled = true;
    }, false);
    messageText.addEventListener('input', function (e) {
        messageSend.disabled = !e.currentTarget.value;
    }, false);
    messageSend.addEventListener('click', function (e) {
        if (!messageText.value) return;
        addMessage(messageText.value);
        messageText.value = null;
        e.currentTarget.disabled = true;
    }, false);

    stickerToggle.addEventListener('click', function () {
        mainContainer.classList.toggle('show-stickers');
    }, false);
    function buildSticker(sticker) {
        if(!sticker || !sticker.item || !sticker.set || !stickers[sticker.set] || !stickers[sticker.set].stickers[sticker.item]) return null;
        var _sticker = stickers[sticker.set].stickers[sticker.item];

        var s = document.createElement('div');
        s.classList.add('sticker');
        s.classList.add('large');
        s.classList.add('horizontal-align-middle');
        s.classList.add('s' + _sticker.image);
        if (_sticker.positionsL) {
            s.dataset.animatePositions = _sticker.positionsL.join(',');
            s.dataset.animateDelay = _sticker.delay || 200;
            s.dataset.animating = "";
            s.addEventListener('mousemove', animateSticker, false);
        }

        return s;
    }
    function addSticker(e) {
        addMessage({ item: e.currentTarget.dataset.stickerItem, set: e.currentTarget.dataset.stickerSet });
        mainContainer.classList.remove('show-stickers');
    }
    function animateSticker(e) {
        e = e.target;
        if (e.dataset.animating) return;
        if (!e.dataset.animatePositions) return;
        e.dataset.animating = 1;

        var positions = e.dataset.animatePositions.split(',');
        var delay = e.dataset.animateDelay || 200;
        var pos = 1;

        var loop = window.setInterval(function () {
            e.style.backgroundPosition = positions[pos++];
            if (pos >= positions.length) pos = 0;
        }, delay);
        window.setTimeout(function () {
            window.clearInterval(loop);
            e.dataset.animating = "";
        }, ((positions.length * 10) + 1) * delay);
    }

    var currentStickerSet;
    function initStickerSet(setName) {
        if(!(setName in stickers)) return;
        if(currentStickerSet && currentStickerSet == setName) return;

        currentStickerSet = setName;
        //-- Remove all child
        while(stickersContainer.children.length) {
            stickersContainer.children[0].parentNode.removeChild(stickersContainer.children[0]);
        }

        //-- Add new
        for(var key in stickers[setName].stickers) {
            if (!stickers[setName].stickers.hasOwnProperty(key)) return;
            var sticker = stickers[setName].stickers[key];

            var s = document.createElement('div');
            s.classList.add('sticker');
            s.classList.add('small');
            s.classList.add('align-middle-center');
            s.classList.add('s' + sticker.image);
            if (sticker.positions) {
                s.dataset.animatePositions = sticker.positions.join(',');
                s.dataset.animateDelay = sticker.delay || 200;
                s.dataset.animating = "";
                s.addEventListener('mousemove', animateSticker, false);
            }

            var w = document.createElement('div');
            w.classList.add('sticker-wrapper');
            w.dataset.stickerItem = sticker.image;
            w.dataset.stickerSet = setName;
            w.addEventListener('click', addSticker, false);
            w.appendChild(s);

            stickersContainer.appendChild(w);
        }
    }
    function initStickers() {
        for(var setName in stickers) {
            if(!stickers.hasOwnProperty(setName)) return;

            var se = document.createElement('div');
            se.classList.add('sticker-set');
            se.style.backgroundImage = 'url(images/stickers/' + stickers[setName].image + '.png)';
            se.dataset.stickerSet = setName;
            if(stickers[setName].default) {
                se.classList.add('active');
                initStickerSet(setName);
            }

            se.addEventListener('click', function(e) {
                initStickerSet(e.currentTarget.dataset.stickerSet);
            }, false);

            stickerSets.appendChild(se);
        }
    }
    initStickers();

    this.members = {};
    this.messages = { __global: [], __unknown: [] };
    this.searchResults = [];

    messagesTab.addEventListener('click', showTabMessage, false);
    notificationsTab.addEventListener('click',showTabNotifications, false);
    moreFriendButton.addEventListener('click', showTabSearch, false);
    hideMessagesBtn.addEventListener('click', showMembers, false);

    function stripMessage(content) {
        var div = document.createElement('div');
        div.innerHTML = content;
        var scripts = div.getElementsByTagName('script');
        var i = scripts.length;
        while (i--) {
            scripts[i].parentNode.removeChild(scripts[i]);
        }
        return div.innerHTML;
    }
    function filterMessage(content) {
        // Remove all script tag from message
        content = stripMessage(content);

        // Replace link
        content = content.replace(linkRegex, function (url) {
            return '<a href="' + url + '" target="_blank">' + url + '</a>';
        });

        // Replace emo
        emoticons.forEach(function (emo) {
            content = content.replace(emo.regex, function () {
                return '<div class="emoticon e' + emo.image + '" title="' + (emo.title || '') + '"></div>';
            });
        });

        return content;
    }
    function pushShowMore(lastShow) {
        var s = document.createElement('div');
        s.classList.add('message');
        s.classList.add('message-show-more');
        s.innerHTML = '<i class="fa fa-angle-up fa-2x"></i>\n' +
                      '<p>Show older messages...</p>';

        s.dataset.lastIndex = lastShow;
        s.addEventListener('click', function(e) {
            initMessages(e.currentTarget.dataset.lastIndex);
            e.currentTarget.parentNode.removeChild(e.currentTarget); //Remove itself
        }, false);
        messagesWrapper.insertBefore(s, messagesWrapper.firstChild);
    }
    function pushMessage(message, user, insert, pos) {
        if(insert) {
            if (!(message.to in self.members))
                return AccountManager.getMemberAccountInfo()
                    .then(function(info) {
                        initMember(info);
                        pushMessage(message, info, 1);
                    });

            if(!self.messages[message.to]) self.messages[message.to] = [];
            message.index = self.messages[message.to].length;
            self.messages[message.to].push(message);

            if (self.messages[message.to].length > maxMessage)
                self.messages[message.to].splice(0, self.messages[message.to].length - maxMessage);

            var openChat = isShowingMessages();
            var sameChat = (message.to == (lastChatWith ? lastChatWith.dataset.chatWith : ''));
            var focus = WindowState.getState();

            if((!sameChat || !openChat) && message.to in self.members) {
                self.members[message.to].ele.classList.add('has-message');
                self.members[message.to].ele.dataset.isNotification = message.isNotification || 0;
            }
            if((!openChat || !sameChat || !focus) && !message.noSound) ToolsManager.playSound('newMessage');
            if(!sameChat) return;

            //-- Tab, same chat
            if(message.isNotification) showHasNewNotification();
            else showHasNewMessage();
        }

        user = user || self.members[message.username] ||
            (message.username == AccountManager.getAccountInfo().username ? AccountManager.getAccountInfo() : {fullname: "Unknown"});

        if (typeof(message.content) == 'string') {
            if(sharedKeyRegex.test(message.content)) {
                if(AccountManager.getAccountInfo().username == message.username) {
                    user.content = filterMessage('Join with me! :)');
                } else {
                    var sharedKey = message.content.replace(/(\[\[|\]\])/g, '');
                    user.content = buildJoinButton(sharedKey);
                }
            } else user.content = filterMessage(message.content);
        } else if(typeof(message.content) == 'object') {
            user.content = buildSticker(message.content);
        } else return;
        if(!user.content) return;

        // Avatar
        var p = document.createElement('div');
        p.classList.add('picture');
        p.classList.add('avatar-picture');
        p.innerHTML = '<i class="fa fa-user"></i>';
        if (user.picture) p.style.backgroundImage = 'url(' + user.picture + ')';
        else if (message.my && AccountManager.getAccountInfo().picture) p.style.backgroundImage = 'url(' + AccountManager.getAccountInfo().picture + ')';
        else p.classList.add('empty');

        // Title
        var t = document.createElement('div');
        t.classList.add('title');
        t.innerHTML =
            '<a class="name" target="_blank" ' + (user.link ? 'href="' + user.link + '"' : '') + '">' + user.fullname + '</a>' +
            '&nbsp;&nbsp;<span class="time">at ' + message.time + '</span>';

        // Content
        var c = document.createElement('div');
        c.classList.add('content');
        if(typeof(user.content) == 'string') {
            c.innerHTML = user.content;
        } else {
            c.appendChild(user.content);
        }

        // Wrapper
        var m = document.createElement('div');
        m.classList.add('message');
        m.dataset.index = message.index;
        if (message.joined) m.classList.add('join');
        else if (message.leaved) m.classList.add('leave');
        else if (AccountManager.getAccountInfo().username == message.username) m.classList.add('my');
        m.appendChild(p);
        m.appendChild(t);
        m.appendChild(c);

        var wrapper = message.isNotification ? notificationsWrapper : messagesWrapper;
        if(!pos || pos != 'top' || !wrapper.children.length) {
            wrapper.appendChild(m);
            window.setTimeout(function () {
                wrapper.scrollTop = wrapper.scrollHeight;
            }, 50);
        } else {
            wrapper.insertBefore(m, wrapper.firstChild);
        }
    }
    function addMessage(content) {
        if (!content || !lastChatWith) return;
        var d = new Date();
        var m = {
            to: lastChatWith.dataset.chatWith,
            username: AccountManager.getAccountInfo().username,
            time: (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ':'
                + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + ':'
                + (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()),
            content: content
        };
        if(m.to != '__global') SocketManager.sendMessage(m, m.to);
        else SocketManager.broadcastMessage(m);
        pushMessage(m, AccountManager.getAccountInfo(), 1);
    }
    function _buildNotificationMessage(message, from, to) {
        var d = new Date();
        return {
            to: to,
            username: from,
            time: (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ':'
                + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + ':'
                + (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()),
            content: message,
            isNotification: 1
        };
    }
    function addNotification(message, from, to, type) {
        if (!message) return;
        if(to != '__global' && to != AccountManager.getAccountInfo().username) return;

        if(!(from in self.members)) {
            AccountManager.getMemberAccountInfo(from)
                .then(function(info) {
                    initMember(info);
                    var m = _buildNotificationMessage(message, from, to);
                    m.to = m.username;
                    NotifyManager[type](message);
                    pushMessage(m, null, 1);
                })
                .catch(function(err) {
                    NotifyManager.error(err.message);
                });
        } else {
            var m = _buildNotificationMessage(message, from, to);
            m.to = m.username;
            NotifyManager[type](message);
            pushMessage(m, null, 1);
        }
    }
    function initMessages(lastIndex) {
        if(!AccountManager.getLoginStatus()) return;

        var username = lastChatWith.dataset.chatWith;
        if(!(username in self.messages) || !lastIndex) {
            clearMessages();
            if(!(username in self.messages)) return;
        }

        var length = maxShowOlderMessage;
        if(!lastIndex) lastIndex = self.messages[username].length;
        length = Math.min(length, lastIndex);

        for(var i = 1; i <= length; i++) {
            pushMessage(self.messages[username][lastIndex - i], null, 0, 'top');
            if(length < lastIndex && self.messages[username][lastIndex - i].isNotification) length++;
        }
        if(lastIndex - length) pushShowMore(lastIndex - length);
    }
    function clearMessages() {
        while(messagesWrapper.children.length) {
            messagesWrapper.children[0].parentNode.removeChild(messagesWrapper.children[0]);
        }
        while(notificationsWrapper.children.length) {
            notificationsWrapper.children[0].parentNode.removeChild(notificationsWrapper.children[0]);
        }
    }
    function sendOldMessages(username) {
        if(username in self.messages)
            SocketManager.sendMessages({messages: self.messages[username], username: AccountManager.getAccountInfo().username}, username);
    }
    function initFriendInfo() {
        if(!lastChatWith) return;
        var username = lastChatWith.dataset.chatWith;
        if(username == '__global') {
            friendInfoText.innerHTML = "Chat to all member in sharing group " + filterMessage(';)');
            hideFriendStatus();
            return;
        }

        friendInfoContainer.classList.add('is-loading');
        AccountManager.checkFriendStatus(username)
            .then(function(status) {
                if(username != lastChatWith.dataset.chatWith) return;

                if(status.isFriend) {
                    if(status.isVerified) {
                        self.members[username].isFriend = 1;
                    } else {
                        self.members[username].isFriend = 0;
                        self.members[username].friendRequestFrom = status.friendRequestFrom;
                    }
                } else {
                    self.members[username].isFriend = 0;
                    delete self.members[username].friendRequestFrom;
                }

                friendInfoUnFriend.dataset.username = username;
                friendInfoAddFriend.dataset.username = username;
                friendInfoAccept.dataset.username = username;
                friendInfoCancel.dataset.username = username;
                friendInfoReject.dataset.username = username;

                if(self.members[username].isFriend) {
                    //UnFriend
                    friendInfoText.innerHTML = "You are friends " + filterMessage(':D');
                    showIsFriend();
                } else if(self.members[username].friendRequestFrom) {
                    if(self.members[username].friendRequestFrom == AccountManager.getAccountInfo().username) {
                        //Cancel
                        friendInfoText.innerHTML = "Waiting... " + filterMessage(':-s');
                        showWaiting();
                    } else {
                        //Accept-Reject
                        friendInfoText.innerHTML = "Friend requested " + filterMessage(':-?');
                        showNeedReply();
                    }
                } else {
                    //Add friend
                    friendInfoText.innerHTML = "Not friend " + filterMessage(':(');
                    showNotFriend();
                }
                friendInfoContainer.classList.remove('is-loading');
            })
            .catch(function(err) {
                NotifyManager.error(err.message);
            })
            .done();
    }

    var lastChatWith = null;
    function changeActiveUser(e) {
        showMessages();

        if(lastChatWith == e.currentTarget) {
            lastChatWith.classList.add('active');
            lastChatWith.classList.remove('has-message');
            if(lastChatWith.dataset.isNotification == '1' && isShowingTabMessage()) {
                showHasNewNotification();
                delete lastChatWith.dataset.isNotification;
            } else if(lastChatWith.dataset.isNotification == '0' && !isShowingTabMessage()) {
                showHasNewMessage();
                delete lastChatWith.dataset.isNotification;
            } else {
                hideHasNewMessage();
                hideHasNewNotification();
            }

            if(!isShowingTabMessage() && !isShowingTabNotification()) {
                initFriendInfo();
                showTabMessage();
                initMessages();
            }
            return;
        }

        if(lastChatWith) lastChatWith.classList.remove('active');
        lastChatWith = e.currentTarget;

        lastChatWith.classList.add('active');
        lastChatWith.classList.remove('has-message');

        if(lastChatWith.dataset.isNotification == '1' && isShowingTabMessage()) {
            showHasNewNotification();
            delete lastChatWith.dataset.isNotification;
        } else if(lastChatWith.dataset.isNotification == '0' && !isShowingTabMessage()) {
            showHasNewMessage();
            delete lastChatWith.dataset.isNotification;
        } else {
            hideHasNewMessage();
            hideHasNewNotification();
        }

        initFriendInfo();
        showTabMessage();
        initMessages();
    }

    function shareWithFriend(e) {
        e.currentTarget.parentNode.click();
        addMessage('[[' + SocketManager.getSharingKey() + ']]');
    }
    function beFriend(e) {
        var username = e.currentTarget.dataset.username;
        friendInfoContainer.classList.add('is-loading');
        AccountManager.makeFriendRequest(e.currentTarget.dataset.username)
            .then(function(name) {
                NotifyManager.success('Friend request send to ' + name);
                SocketManager.sendFriendRequestStatus(username, {
                    to: username,
                    username: AccountManager.getAccountInfo().username,
                    message: AccountManager.getAccountInfo().fullname + " send you a friend request :)",
                    type: 'info'
                });
            })
            .catch(function(err) {
                err = JSON.parse(err);
                console.log(err);
                NotifyManager.error(err.message);
            })
            .done(function() {
                friendInfoContainer.classList.remove('is-loading');
                initFriendInfo();
            });
    }
    function searchBeFriend(e) {
        var username = e.currentTarget.dataset.username;

        // Remove itself
        var index = 0;
        while(index < self.searchResults.length && self.searchResults[index].username != username) index++;
        var info = self.searchResults.splice(index, 1)[0];
        e.currentTarget.parentNode.parentNode.removeChild(e.currentTarget.parentNode);
        initMember(info);

        AccountManager.makeFriendRequest(e.currentTarget.dataset.username)
            .then(function(name) {
                NotifyManager.success('Friend request send to ' + name);
                SocketManager.sendFriendRequestStatus(username, {
                    to: username,
                    username: AccountManager.getAccountInfo().username,
                    message: AccountManager.getAccountInfo().fullname + " send you a friend request :)",
                    type: 'info'
                });
            })
            .catch(function(err) {
                err = JSON.parse(err);
                console.log(err);
                NotifyManager.error(err.message);
            })
            .done();
    }
    function unFriend(e) {
        var username = e.currentTarget.dataset.username;
        friendInfoContainer.classList.add('is-loading');
        AccountManager.rejectFriendRequest(username)
            .then(function(name) {
                NotifyManager.success('You are no longer friend with ' + name);
                SocketManager.sendFriendRequestStatus(username, {
                    to: username,
                    username: AccountManager.getAccountInfo().username,
                    message: AccountManager.getAccountInfo().fullname + " has just unfriend with you :((",
                    type: 'error'
                });
            })
            .catch(function(err) {
                err = JSON.parse(err);
                console.log(err);
                NotifyManager.error(err.message);
            })
            .done(function() {
                friendInfoContainer.classList.remove('is-loading');
                initFriendInfo();
            });
    }
    function acceptFriendRequest(e) {
        var username = e.currentTarget.dataset.username;
        friendInfoContainer.classList.add('is-loading');
        AccountManager.acceptFriendRequest(username)
            .then(function(name) {
                NotifyManager.success("You are now friend with " + name);
                SocketManager.sendFriendRequestStatus(username, {
                    to: username,
                    username: AccountManager.getAccountInfo().username,
                    message: AccountManager.getAccountInfo().fullname + " has just accepted your friend request ;)",
                    type: 'success'
                });
            })
            .catch(function(err) {
                NotifyManager.error(err.message);
            })
            .done(function() {
                friendInfoContainer.classList.remove('is-loading');
                initFriendInfo();
            });
    }
    function rejectFriendRequest(e) {
        var username = e.currentTarget.dataset.username;
        friendInfoContainer.classList.add('is-loading');
        AccountManager.rejectFriendRequest(username)
            .then(function(name) {
                NotifyManager.success('Rejected friend request from ' + name);
                SocketManager.sendFriendRequestStatus(username, {
                    to: username,
                    username: AccountManager.getAccountInfo().username,
                    message: AccountManager.getAccountInfo().fullname + " rejected your friend request :-s",
                    type: 'warning'
                });
            })
            .catch(function(err) {
                NotifyManager.error(err.message);
            })
            .done(function() {
                friendInfoContainer.classList.remove('is-loading');
                initFriendInfo();
            });
    }
    function cancelFriendRequest(e) {
        var username = e.currentTarget.dataset.username;
        friendInfoContainer.classList.add('is-loading');
        AccountManager.rejectFriendRequest(username)
            .then(function(name) {
                NotifyManager.success('Canceled friend request to ' + name);
                SocketManager.sendFriendRequestStatus(username, {
                    to: username,
                    username: AccountManager.getAccountInfo().username,
                    message: AccountManager.getAccountInfo().fullname + " canceled friend request :-?",
                    type: 'warning'
                });
            })
            .catch(function(err) {
                NotifyManager.error(err.message);
            })
            .done(function() {
                friendInfoContainer.classList.remove('is-loading');
                initFriendInfo();
            });
    }

    friendInfoAddFriend.addEventListener('click', beFriend, false);
    friendInfoCancel.addEventListener('click', cancelFriendRequest, false);
    friendInfoReject.addEventListener('click', rejectFriendRequest, false);
    friendInfoAccept.addEventListener('click', acceptFriendRequest, false);
    friendInfoUnFriend.addEventListener('click', unFriend, false);

    function addMemberPlugin(m) {
        if(!m) return;

        var name = m.dataset.chatWithName;
        
        var c = document.createElement('div');
        c.innerHTML = '<div class="member-plugin-inner chatting align-middle-center"><i class="fa fa-comment"></i></div>';
        c.classList.add('member-plugin-wrapper');
        c.classList.add('chatting-wrapper');
        c.title = 'You are chatting with ' + (m.dataset.chatWith == '__global' ? 'all' : name);
        m.appendChild(c);

        if(name == '__global') return;

        var g = document.createElement('div');
        g.innerHTML = '<div class="member-plugin-inner painting align-middle-center"><i class="fa fa-paint-brush"></i></div>';
        g.classList.add('member-plugin-wrapper');
        g.classList.add('painting-wrapper');
        g.title = name + ' are on this painting group';
        m.appendChild(g);

        var s = document.createElement('div');
        s.innerHTML = '<div class="member-plugin-inner share align-middle-center"><i class="fa fa-share-alt"></i></div>';
        s.classList.add('member-plugin-wrapper');
        s.classList.add('share-wrapper');
        s.dataset.shareWith = m.dataset.chatWith;
        s.title = 'Invite ' + name + ' join this painting group';
        s.addEventListener('click', shareWithFriend, false);
        m.appendChild(s);
    }
    function clearMembers() {
        for(var username in self.members) {
            if(!self.members.hasOwnProperty(username)) continue;

            if(self.members[username].ele)
                self.members[username].ele.parentNode.removeChild(self.members[username].ele);
            delete self.members[username];
            delete self.messages[username];
        }
    }

    function buildMember(info) {
        var m = document.createElement('div');
        m.classList.add('member');
        m.classList.add('avatar');
        m.classList.add('align-middle-center');
        if(info) {
            m.title = info.fullname;
            if(info.picture) {
                m.classList.add('avatar-picture');
                m.style.backgroundImage = 'url(' + info.picture + ')';
            } else {
                m.classList.add('empty');
                m.innerHTML = '<i class="fa fa-user"></i>';
            }
        } else {
            m.title = 'Chat with all on painting group';
            m.classList.add('empty');
            m.innerHTML = '<i class="fa fa-group"></i>';
        }

        var mf = document.createElement('div');
        mf.classList.add('member-wrapper');
        if(info) {
            mf.dataset.chatWith = info.username;
            mf.dataset.chatWithName = info.fullname;

            if(SocketManager.isSharing()) mf.classList.add('is-sharing');
            if(info.isInGroup) mf.classList.add('is-in-group');

            if(info.isOffline) mf.classList.add('offline');
        } else {
            mf.dataset.chatWith = '__global';
            mf.dataset.chatWithName = '__global';
            mf.classList.add('global');
        }

        mf.addEventListener('click', changeActiveUser, false);
        mf.appendChild(m);

        return mf;
    }
    function updateMember(username) {
        if(!username in self.members) return;

        if(self.members[username].isInGroup) {
            self.members[username].ele.classList.add('is-in-group');
            self.members[username].ele.classList.remove('is-not-in-group');
        } else {
            self.members[username].ele.classList.remove('is-in-group');
            self.members[username].ele.classList.add('is-not-in-group');
        }
    }
    function initGlobalMember() {
        var username = '__global';
        if(username in self.members) return;

        self.members[username] = {ele: buildMember()};
        addMemberPlugin(self.members[username].ele);
        membersWrapper.insertBefore(self.members[username].ele, membersWrapper.firstChild);
        updateMember(username);

        if(!lastChatWith) lastChatWith = self.members[username].ele;
    }
    function removeGlobalMember() {
        var username = '__global';
        if(username in self.members)
            self.members[username].ele.parentNode.removeChild(self.members[username].ele);

        delete self.members[username];
        self.messages[username] = [];
        if(lastChatWith.dataset.chatWith == username) {
            clearMessages();
            lastChatWith = null;
        }
    }
    function initMember(info) {
        var username = info.username;
        if(username == AccountManager.getAccountInfo().username) return;

        if(!(username in self.members)) {
            self.members[info.username] = info;
            self.members[info.username].ele = buildMember(self.members[info.username]);
            membersWrapper.appendChild(self.members[info.username].ele);
            addMemberPlugin(self.members[info.username].ele);
        } else {
            self.members[info.username].isInGroup = info.isInGroup;
        }
        updateMember(username);
    }
    function initMembers() {
        if(!AccountManager.getLoginStatus()) clearMembers();
    }

    function getGroupInfo() {
        if(!AccountManager.getLoginStatus()) return;

        SocketManager.getGroupMembers(function(members) {
            members.forEach(function(member) {
                if(member in self.members) {
                    self.members[member].isInGroup = 1;
                    self.members[member].isOffline = 0;
                    updateMember(member);
                    return;
                }

                return AccountManager.getMemberAccountInfo(member)
                    .then(function(_user) {
                        _user.isOffline = 0;
                        _user.isInGroup = 1;
                        initMember(_user);
                    });
            });
        });
    }
    function getFriends() {
        if(!AccountManager.getLoginStatus()) return;

        membersWrapper.classList.add('is-loading');
        Request.get('/friend/my', null)
            .then(__parseStr)
            .then(function(friends) {
                friends.forEach(function(friend) {
                    var v = friend['User1'].username == AccountManager.getAccountInfo().username ? 'User2' : 'User1';
                    AccountManager.getMemberAccountInfo(friend[v].username)
                        .then(function(_user) {
                            _user.isOffline = 0;
                            initMember(_user);
                        }).done();
                });
            }).catch(function(err) { }).done(function() {
                membersWrapper.classList.remove('is-loading');
            });
    }
    function getStatuses() {
        if(!AccountManager.getLoginStatus()) return;

        var usernames = [];
        for(var username in self.members) {
            if(self.members.hasOwnProperty(username) && username != '__global')
                usernames.push(username);
        }
        SocketManager.getOnlineStatus(usernames, function(statuses) {
            if(!statuses) return initMembers();

            for(var username in statuses) {
                if(!statuses.hasOwnProperty(username)) continue;
                if(username in self.members) {
                    if(statuses[username]) {
                        self.members[username].isOffline = 0;
                        if(self.members[username].ele && self.members[username].ele.classList.contains('offline')) {
                            self.members[username].ele.classList.remove('offline');
                            // On online - send messages
                            sendOldMessages(username);
                        }
                    } else {
                        self.members[username].isOffline = 1;
                        if(self.members[username].ele && !self.members[username].ele.classList.add('offline')) {
                            self.members[username].ele.classList.add('offline');
                            // Go offline
                        }
                    }
                }
            }
        });
    }

    function buildJoinButton(sharedKey) {
        var b = document.createElement('button');
        b.classList.add('btn');
        b.classList.add('btn-primary');
        b.classList.add('btn-gap');
        b.innerHTML = '<i class="fa fa-sign-in"></i>  Join with me!';
        b.dataset.sharedKey = sharedKey;
        b.addEventListener('click', function(e) {
            joinSharing(e.currentTarget.dataset.sharedKey);
        }, false);

        var s = document.createElement('span');
        s.appendChild(b);

        return s;
    }
    function clearSharingKey() {
        for(var username in self.members) {
            if(!self.members.hasOwnProperty(username)) continue;

            self.members[username].isInGroup = 0;
            updateMember(username);
        }
    }
    function startSharing() {
        SocketManager.startSharing(null, function(sharingKey) {
            if(!sharingKey) return NotifyManager.error('Not identified!');
            NotifyManager.success('Shared successfully.');
        });
    }
    function joinSharing(sharedKey) {
        SocketManager.joinSharing(sharedKey, function(err) {
            if(err) {
                NotifyManager.error(err.message);
            } else {
                NotifyManager.success('Joined successfully.');
            }
        });
    }
    function leaveSharing() {
        SocketManager.leaveSharing(function() {
            NotifyManager.success('Leaved successfully.');
        });
    }
    startSharingButton.addEventListener('click', startSharing, false);
    stopSharingButton.addEventListener('click', leaveSharing, false);

    memberSearchText.addEventListener('change', function (e) {
        if (!e.currentTarget.value) return;
        searchUser(e.currentTarget.value);
        e.currentTarget.value = null;
    }, false);
    memberSearchText.addEventListener('input', function (e) {
        memberSearchSend.disabled = !e.currentTarget.value;
    }, false);
    memberSearchSend.addEventListener('click', function (e) {
        if (!memberSearchText.value) return;
        searchUser(memberSearchText.value);
        memberSearchText.value = null;
    }, false);
    function buildSearchResult(info) {
        var a = document.createElement('div');
        a.classList.add('result-add-friend');
        a.innerHTML = '<i class="fa fa-plus fa-2x"></i>';
        a.dataset.username = info.username;
        a.addEventListener('click', searchBeFriend, false);

        var r = document.createElement('div');
        r.classList.add('search-result');
        r.innerHTML += '<div class="result-picture avatar avatar-picture ' + (info.picture ? '' : 'empty') + '" style="background-image: url(' + info.picture + ')"><i class="fa fa-user"></i></div>';
        r.innerHTML += '<div class="result-info">\n' +
                       '<span class="result-info-name">' + info.fullname + '</span>\n' +
                       '<span class="result-info-username">(' + info.username + ')</span></br>\n' +
                       '<span class="result-info-date"></span>\n' +
                       '</div>';
        r.appendChild(a);

        return r;
    }
    function searchUser(text) {
        searchResultWrapper.classList.add('is-loading');
        AccountManager.findUserNotFriend(text)
            .then(function(users) {
                self.searchResults = users;
                initSearchResults();
            })
            .catch(function(err) {
                NotifyManager.error(err.message);
            })
            .done(function() {
                searchResultWrapper.classList.remove('is-loading');
            });
    }
    function initSearchResults() {
        while(searchResultWrapper.children.length) {
            searchResultWrapper.children[0].parentNode.removeChild(searchResultWrapper.children[0]);
        }

        self.searchResults.forEach(function(result) {
            var res = AccountManager.updateMemberAccountInfo(result);
            if(res.then)
                res.then(function(user) {
                    user.isOffline = 0;
                    searchResultWrapper.appendChild(buildSearchResult(user))
                });
            else searchResultWrapper.appendChild(buildSearchResult(res));
        });

        if(!self.searchResults.length) {
            searchResultWrapper.innerHTML = '<div class="message message-empty">Sorry. No user match with your search.' + filterMessage(':-s') + '</div>';
        }
    }

    function _newMember(user) {
        user.isInGroup = 1;
        user.isOffline = 0;
        initMember(user);

        NotifyManager.info(user.fullname + ' has just joined');
        var m = _buildNotificationMessage('Joined', user.username, '__global');
        m.joined = 1;

        pushMessage(m, user, 1);
        ToolsManager.playSound('newMember');
    }
    SocketManager.on('newMember', function (username) {
        var user;
        if(username == AccountManager.getAccountInfo().username)
            user = AccountManager.getAccountInfo();

        if(!user) {
            AccountManager.getMemberAccountInfo(username)
                .then(function(user) {
                    _newMember(user);
                })
                .catch(function(err) {
                    console.log(err);
                    ToolsManager.playSound('newMember');
                    NotifyManager.info(username + ' has just joined');
                });
        } else {
            _newMember(user);
        }
    });
    function _leavedMember(user) {
        user.isInGroup = 0;
        initMember(user);

        NotifyManager.warning(user.fullname + ' had leaved');
        var m = _buildNotificationMessage('Leaved', user.username, '__global');
        m.leaved = 1;

        pushMessage(m, user, 1);
        ToolsManager.playSound('leavedMember');
    }
    SocketManager.on('leavedMember', function (username) {
        var user = self.members[username];
        if(username == AccountManager.getAccountInfo().username)
            user = AccountManager.getAccountInfo();

        if(!user) {
            AccountManager.getMemberAccountInfo(username)
                .then(function(user) {
                    _leavedMember(user);
                })
                .catch(function(err) {
                    console.log(err);
                    NotifyManager.warning(username + ' had leaved');
                    ToolsManager.playSound('leavedMember');
                });
        } else {
            _leavedMember(user);
        }
    });
    SocketManager.on('newMessage', function (message) {
        if (!message) return;

        var user = self.members[message.username];
        if(message.username == AccountManager.getAccountInfo().username)
            user = AccountManager.getAccountInfo();

        if(!user) {
            AccountManager.getMemberAccountInfo(message.username)
                .then(function(info) {
                    initMember(info);

                    if(message.to && message.to != '__global' && message.to != AccountManager.getAccountInfo().username) return;
                    if(message.to == AccountManager.getAccountInfo().username) message.to = message.username;

                    pushMessage(message, user, 1);
                })
                .catch(function(err) {
                    console.log(err);
                });
        } else {
            if(message.to && message.to != '__global' && message.to != AccountManager.getAccountInfo().username) return;
            if(message.to == AccountManager.getAccountInfo().username) message.to = message.username;

            pushMessage(message, user, 1);
        }
    });
    SocketManager.on('newMessages', function (data) {
        if(!data || !data.username || !data.messages || !data.messages.length) return;
        
        var user = self.members[data.username];
        if(data.username == AccountManager.getAccountInfo().username)
            user = AccountManager.getAccountInfo();

        if(!user) {
            AccountManager.getMemberAccountInfo(data.username)
                .then(function(user) {
                    initMember(user);

                    self.messages[data.username] = [];
                    data.messages.forEach(function(message) {
                        if(message.to && message.to != '__global' && message.to != AccountManager.getAccountInfo().username) return;
                        if(message.to == AccountManager.getAccountInfo().username) message.to = data.username;
                        message.noSound = 1;

                        self.messages[data.username].push(message);
                    });

                    if(!lastChatWith) {
                        lastChatWith = self.members[data.username].ele;
                        lastChatWith.classList.add('has-message');
                    }
                    if(lastChatWith.dataset.chatWith != data.username)
                        lastChatWith.classList.add('has-message');

                    initMessages();
                    ToolsManager.playSound('newMessage');
                })
                .catch(function(err) {
                    console.log(err);
                });
        } else {
            self.messages[data.username] = [];
            data.messages.forEach(function(message) {
                if(message.to && message.to != '__global' && message.to != AccountManager.getAccountInfo().username) return;
                if(message.to == AccountManager.getAccountInfo().username) message.to = data.username;
                message.noSound = 1;

                self.messages[data.username].push(message);
            });

            if(!lastChatWith) {
                lastChatWith = self.members[data.username].ele;
                lastChatWith.classList.add('has-message');
            }
            if(lastChatWith.dataset.chatWith != data.username)
                lastChatWith.classList.add('has-message');

            initMessages();
            ToolsManager.playSound('newMessage');
        }
    });
    
    SocketManager.on('requestInitMessages', function (done) {
        done(self.messages.__global);
    });
    SocketManager.on('sharingInitMessages', function (messages) {
        self.messages.__global = messages;
        initMessages();

        if (!messageToggle.classList.contains('active')) {
            messageToggle.classList.add('new-message');
            ToolsManager.playSound('newMessage');
        } else if (!WindowState.getState()) {
            ToolsManager.playSound('newMessage');
        }
    });

    SocketManager.on('friendRequestChanged', function(info) {
        addNotification(info.message, info.username, info.to, info.type);
        initFriendInfo();
    });

    SocketManager.on('startSharing', function() {
        showIsSharing();
        clearSharingKey();
        initGlobalMember();
        getGroupInfo();
    });
    SocketManager.on('joinSharing', function() {
        showIsSharing();
        clearSharingKey();
        initGlobalMember();
        getGroupInfo();
    });
    SocketManager.on('stopSharing', function() {
        showIsNotSharing();
        clearSharingKey();
        removeGlobalMember();
    });
    SocketManager.on('connected', function() {
        showIsNotSharing();
        showMembers();
        getFriends();
    });
    SocketManager.on('disconnected', function() {
        hideAll();
    });

    AccountManager.on('signedOut', function() {
        hideAll();
        clearMembers();
        removeGlobalMember();
    });

    var loopUpdateStatuses = window.setInterval(getStatuses, 3000);
};
