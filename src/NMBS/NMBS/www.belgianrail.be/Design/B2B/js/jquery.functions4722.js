/*
Functions
*/

window.brail = window.brail || {};

/*
Menu / Fly-out menu
*/

brail.menu = {
    $h: '',
    config: {
        interval: 0,
        sensitivity: 2,
        over: function (e) { brail.menu.handler('over', jQuery(this)); },
        out: function (e) { brail.menu.handler('out', jQuery(this)); },
        timeout: 500
    },
    init: function () {
        var _self = brail.menu,
            h = jQuery('.js-mainnav > li').hoverIntent(_self.config);

        _self.$h = h;

        _self.focus(h);
        _self.resize(h, h.parents('.js-mainnav').width());
        _self.position(h, h.parents('.js-mainnav'));

        jQuery('.js-mainnav li:last-child').addClass('last-child');
    },
    handler: function (type, object) {
        var _self = brail.menu;

        var $fly = object.find('.js-fly-out-wrapper');

        if (type == 'over') {
            if (!$fly.find('ul:first').children().length > 0)
                return false;

            _self.$h.removeClass('hovered');

            object.addClass('hovered');
        } else {
            object.removeClass('hovered');
        }
    },
    focus: function (items) {
        items.children('a')
			.bind('focus', function (e) {
			    var $this = jQuery(this),
					$parents = $this.parents('li');

			    items.removeClass('hovered');

			    if (!$parents.find('.js-fly-out-wrapper ul:first').children().length > 0)
			        return false;

			    $parents.addClass('hovered');
			});

        items.find('.js-fly-out-wrapper a')
			.bind('focus', function (e) {
			    var $this = jQuery(this),
					$parents = $this.parents('.js-fly-out-wrapper').parent();

			    $parents.addClass('hovered');
			});

        var lastBlur = items.find('a').last();

        lastBlur.bind('blur', function (e) {
            items.removeClass('hovered');
        });
    },
    resize: function (items, totalWidth) {
        var cWidth = 0,
			rWidth = 0,
			c = items.length,
			r = 0,
			newItems = [];

        items.each(function (i) {
            var $this = jQuery(this);

            $this.css({ 'white-space': 'nowrap' });

            var width = $this.width();

            if ($this.width() > 140) {
                newItems.push({
                    'object': $this,
                    'width': width
                });
                rWidth += width;
            }

            $this.css({ 'white-space': 'normal' });

            cWidth += width;

        });

        if (cWidth < totalWidth) {
            r = totalWidth - cWidth;

            items.each(function (i) {
                var $this = jQuery(this);

                $this.children('a').width(function () {
                    var $a = jQuery(this);

                    return ((r / c) + $a.width());
                });
            });
        } else if (jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 8) {
            navWidth = jQuery('.js-mainnav').width();
            navItems = jQuery('.js-mainnav > li').length;

            jQuery('.js-mainnav > li').each(function (i) {
                for (var i = 0; i < navItems; ++i) {
                    var $this = jQuery(this);

                    $this.width(navWidth / navItems);

                }
            });

            jQuery('.js-mainnav').addClass('rendered');

            return false;
        }
    },
    position: function (items, menu) {
        items.each(function (i) {
            var $item = jQuery(this),
				$this = $item.find('.js-fly-out-wrapper'),
                last = $item.hasClass('last-child') ? true : false;

            if (!$this.length > 0)
                return true;

            $this.css({
                'display': 'block',
                'position': 'static',
                'top': 0
            });

            //position fly-out menu
            var $fly = $this.find('.fly-out-content'),
				l = $fly.position().left

            $fly.css({ left: 0 });

            var w = ($fly.find('.inner > ul').children().length * 203) - 6 + 20;

            //resize flyout menu if size is smaller than item
            (function (width) {
                //add extra width due the negative margins
                if (width + 5 > w) {
                    $fly
                        .width(width + 40)
                        .find('.inner > ul').width(width + 20);

                    w = width + 40;
                }
            })($item.width());

            if (parseInt(l + w, 10) > parseInt(menu.position().left + menu.width(), 10)) {
                $fly
					.css({
					    'margin-left': (w - $item.width() - 4 + (last ? 4 : 0) + (jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 9 ? 1 : 0)) * -1
					});

                $this.addClass('fly-out-wrapper-rtl');
            }

            $fly.css({ left: 'auto' });

            //generate equal height columns
            (function () {
                var height = 0;

                $fly.find('ul:first').find('> div')
					.each(function (i) {
					    var $this = jQuery(this),
							tempHeight = $this.height();

					    if (height < tempHeight) {
					        height = tempHeight;
					    }
					})
					.height(height);
            })();

            //reset display
            $this
                .css({
                    'display': '',
                    'position': ''
                })
                .removeClass('preload');
        });
    }
}

brail.wizardSteps = {
    init: function () {
        if (!(jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 8))
            return false;

        var steps = jQuery('.js-wizardsteps');

        if (steps.length == 0)
            return false;

        var tWidth = steps.width(),
			cWidth = 0,
			items = steps.find('li'),
			nItems = items.length;

        items.each(function (i) {
            cWidth += jQuery(this).width();
        });

        var r = Math.floor((tWidth - cWidth) / nItems);

        items.each(function (i) {
            var $this = jQuery(this);

            $this.outerWidth((function (w) {
                return w + r;
            })($this.width()));
        });
    }
}

brail.leftMenu = {
    init: function () {
        var textPlaceholder = [];

        jQuery('.menu ul li ul li ul').hide();
        //jQuery('.menu ul li ul .selected ul').show();
        jQuery(document).ready(function () {
            jQuery('.menu li ul li ul li').filter('.selected').each(function (i) {
                if (jQuery(this).hasClass("selected")) {
                    jQuery(this).parent().parent().addClass("selected-child");
                    jQuery('.menu ul li ul .selected ul').show();
                }
                else {
                    return false;
                }
            });
            jQuery('.menu ul li ul li div a').filter(".leftMenu-icon").each(function (i) {
                var $this = jQuery(this),
					$p = $this.parent().parent();

                if ($this.hasClass("leftMenu-icon")) {
                    textPlaceholder[0] = $this.find('.js-leftmenu-show').remove()[0];
                    textPlaceholder[1] = $this.find('.js-leftmenu-hide').remove()[0];

                    if ($p.hasClass('selected'))
                        $this.html(textPlaceholder[1]);
                    else
                        $this.html(textPlaceholder[0]);

                    $this.parent().find('.secondLevelLink').css({ 'padding-left': '0' });
                }
                else {
                    return false;
                }
            });

            jQuery('.menu ul li ul .selected ul').each(function (i) {
                if (jQuery(this).show()) {
                    jQuery(this).parent().addClass("active");
                }
                else {
                    return false;
                }
            });
        });

        jQuery('.menu ul li .leftMenu-icon').bind('click', function () {
            var $icon = jQuery(this),
				self = $icon.closest('li'),
				$this = self.find('ul');

            var openM = function (o) {
                o
						.slideDown()
						.removeClass('js-left-nav')
						.parent()
						.addClass('active');

                $icon.html(textPlaceholder[1]);
            },
				closeM = function (o) {
				    o
						.slideUp()
						.addClass('js-left-nav')
						.parent()
						.removeClass('active');

				    $icon.html(textPlaceholder[0]);
				};

            if (self.hasClass('active'))
                closeM($this);
            else
                openM($this);
        });
    }
}


brail.equalHeight = {
    init: function () {
        var currentTallest = 0,
            currentRowStart = 0,
            rowDivs = [],
            $el,
            topPosition = 0;

        jQuery('.js-items-height').each(function () {
            $el = jQuery(this);
            topPostion = $el.position().top;

            if (currentRowStart != topPostion) {
                for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                    rowDivs[currentDiv].height(currentTallest);
                }

                rowDivs.length = 0;
                currentRowStart = topPostion;
                currentTallest = $el.height();
                rowDivs.push($el);
            } else {
                rowDivs.push($el);
                currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
            }

            for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                rowDivs[currentDiv].height(currentTallest);
            }
        });
    },
    equalHeight: function (group) {
        tallest = 0;
        group.each(function () {
            thisHeight = jQuery(this).height();
            if (thisHeight > tallest) {
                tallest = thisHeight;
            }
        });
        group.height(tallest);
    },
    simplifyList: function () {
        if (document.getElementById('cityAdvantagesPanel')) {
            var $advPanel = jQuery('#cityAdvantagesPanel'),
							items = ['h4', '.thumbnail-container > img', '.txt'],

							$el = [];

            //loop through each panel
            $advPanel.find('.cityAdvantagesPanel').each(function (i) {
                var $panels = jQuery(this).find('.mod-blue-border'),
								heights = { title: 0, img: 0, txt: 0 };

                var nElements = $panels.length;

                $panels.each(function (j) {
                    var $panel = jQuery(this),
									tHeight = { title: 0, img: 0, txt: 0 };

                    //title
                    tHeight.title = $panel.find('h4').height();

                    //img
                    tHeight.img = $panel.find('.thumbnail-container > img').height();

                    //content
                    tHeight.txt = $panel.find('.txt').height();

                    if (tHeight.title > heights.title) {
                        heights.title = tHeight.title;
                    }

                    if (tHeight.img > heights.img) {
                        heights.img = tHeight.img;
                    }

                    if (tHeight.txt > heights.txt) {
                        heights.txt = tHeight.txt;
                    }

                    if ((j > 0 && (j + 1) % 3 == 0) || j == nElements - 1) {
                        $el.push($panel);

                        for (var k = 0, len = $el.length; k < len; ++k) {
                            $el[k].find('h4').height(heights.title);
                            $el[k].find('.thumbnail-container > img').height(heights.img);
                            $el[k].find('.txt').height(heights.txt);
                        }

                        heights = { title: 0, img: 0, txt: 0 };

                        $el = [];

                        $panel.after('<div class="clear"/>');
                    } else {
                        $el.push($panel);
                    }
                });
            });

            return false;
        }

        brail.equalHeight.equalHeight(jQuery('.cityAdvantagesPanel .js-list-height'));
        brail.equalHeight.equalHeight(jQuery('.leisureResult .js-list-height'));
        brail.equalHeight.equalHeight(jQuery('.product-list .js-list-height'));
        brail.equalHeight.equalHeight(jQuery('.stationResult .js-list-height'));
        brail.equalHeight.equalHeight(jQuery(".freecontent.summaryPage .txt"));
    },

    simplifyTitle: function () {
        if (!document.getElementById('cityAdvantagesPanel'))
            brail.equalHeight.equalHeight(jQuery(".js-title-height"));
    },

    simplifyImage: function () {
        brail.equalHeight.equalHeight(jQuery(".js-img-height"));
    },

    simplifyTxt: function () {
        brail.equalHeight.equalHeight(jQuery(".js-txt-height"));
    },

    simplifyForm: function () {
        brail.equalHeight.equalHeight(jQuery(".js-form-height"));
    },

    simplifyCta: function () {
        brail.equalHeight.equalHeight(jQuery(".js-cta-height"));
    },

    simplifyBox: function () {
        brail.equalHeight.equalHeight(jQuery(".js-box-height"));
    },

    simplifyColorboxTable: function () {
        brail.equalHeight.equalHeight(jQuery('.js-table-height'));
    }

}

brail.slider = {
    init: function () {
        var $s = jQuery('.js-slider-landing');

        if ($s.length > 0) {
            //short slider
            $s.anythingSlider({
                width: 703,
                height: 295,
                expand: false,
                resizeContents: false, // If true, solitary images/objects in the panel will expand to fit the viewport
                buildArrows: false,
                autoPlay: true, // This turns off the entire slideshow FUNCTIONALY, not just if it starts running or not
                startStopped: true
            });
        } else {
            //long slider
            jQuery('.js-slider-long').anythingSlider({
                width: 945,
                height: 168,
                resizeContents: false,
                buildArrows: false,
                autoPlay: true,
                startStopped: true
            });
            //reposition slider navigation
            var $box = jQuery('.js-boxoverslider');

            if ($box.length > 0) {
                $box.parent().find('.sliderDiv').addClass('boxoverslider');
                var $nav = jQuery('.anythingControls .thumbNav');

                if ($nav.length > 0) {
                    $nav.css({
                        'right': $box.width()
                    });
                }
                jQuery('.anythingControls .start-stop').css({
                    'right': $box.width()
                });
            }
        }

    },
    showContent: function () {
        var $sliderContent = jQuery('.js-slider-landing').children();

        $sliderContent.show();
    },

    sliderTimeTable: function () {
        jQuery('.js-slider-landing-timetable').anythingSlider({
            width: 450,
            height: 325,
            expand: false,
            resizeContents: false,
            buildArrows: false,
            autoPlay: true,
            startStopped: true
        });
    }

};

brail.form = {
    checkbox: {
        init: function () {
            var $checkboxes = jQuery('.js-checkboxhandler').find('input[type="checkbox"]'),
                $all = '';

            if ($checkboxes.length == 0) {
                return false;
            }

            $all = $checkboxes.filter(':first');

            $checkboxes.bind('change', function () {
                var $this = jQuery(this);

                if ($this.attr('id') == $all.attr('id')) {
                    //all is checked
                    $checkboxes.not($all).attr('checked', false);
                } else {
                    //other checkbox checked
                    $all.attr('checked', false);
                }
            });
        }
    }
}

brail.datepickerInit = {
    init: function () {
        jQuery(".js-datepicker").datepicker({ dateFormat: 'dd/mm/yy' });
        jQuery("a.js-datepicker").click(
            function () {
                var $this = jQuery(this);

                $this.parent().find('input.js-datepicker').datepicker('show');

                return false;
            }
        );

    }
}

brail.accordion = {
    $questions: '',
    $squestions: '',
    $fquestions: '',
    $fanswers: '',
    $prevE: '',
    init: function () {
        var _self = brail.accordion;

        jQuery('.js-faq > li:nth-child(even)').addClass('nth-child-even');

        jQuery('.js-faq > li.selected').each(function (i) {
            var $this = jQuery(this);

            $this
                .removeClass('selected')
                .find('.js-fquestion').addClass('selected')
                .end()
                .find('.js-fquestions').show();

            _self.$prevE = $this.find('.js-fquestion');
        });

        _self.$questions = jQuery('.js-fquestion');
        _self.$squestions = jQuery('.js-squestion');
        _self.$fquestions = jQuery('.js-fquestions');
        _self.$fanswers = jQuery('.js-fanswer');

        _self.$questions.bind('click', function () {
            var $this = jQuery(this);

            _self.clickhandler($this, '.js-fquestions');

            _self.$prevE = $this;
        });

        _self.$squestions.bind('click', function () {
            var $this = jQuery(this);

            _self.clickhandler($this, '.js-fanswer');

            _self.$prevE = $this;
        });
    },
    clickhandler: function ($o, p) {
        var _self = brail.accordion;

        if (_self.$prevE.length > 0 && _self.$prevE[0] !== $o[0]) {
            if (p == '.js-fquestions') {
                _self.$fquestions.not($o).slideUp();
                _self.$questions.not($o).removeClass('selected');
                _self.$fanswers.not($o).slideUp();
                _self.$squestions.not($o).removeClass('selected');
            } else {
                _self.$fanswers.not($o).slideUp();
                _self.$squestions.not($o).removeClass('selected');
            }
        }

        if ($o.hasClass('selected')) {
            $o
                .removeClass('selected')
                .parent()
                .find(p)
                .slideUp();
        } else {
            $o
                .addClass('selected')
                .parent()
                .find(p)
                .slideDown();
        }
    }
},

brail.sitemap = {
    init: function () {
        jQuery('.js-sitemap > li:nth-child(even)').addClass('nth-child-even');

        var $icons = jQuery('.js-sitemapicon');

        $icons.bind('click', function () {
            var $this = jQuery(this),
                $subitems = $this.parent().children('ul'),
                $allitems = $this.parentsUntil('ul').parent();

            $allitems.find($icons).not($this).next().removeClass('selected');
            $allitems.find($icons).not($this).removeClass('selected');
            $allitems.find('ul').slideUp();

            if ($this.hasClass('selected')) {
                $this.removeClass('selected').next().removeClass('selected');
                $subitems.slideUp();
            } else {
                $this.addClass('selected').next().addClass('selected');
                $subitems.slideDown();
            }


        });
    }
},

brail.bExcursionCatSummary = {
    init: function () {
        jQuery(".bExcursionCatSummary:last-child")
            .css({ border: "none" });
    }
},

brail.titleHeaderBg = {
    init: function () {

        jQuery(".pop-in-grid").each(function (i) {
            if (jQuery(this).find(".header").length > 0) {
                jQuery(this).addClass('white-gradient');
            }
            else {
            }
        });
    }

},


brail.backgroundImage = {
    init: function () {
        jQuery(document).ready(function () {
            jQuery(".wrapper").fadeIn(30000, function () {
                jQuery(this).addClass("loaded");
            });
        });

    }
},


brail.tabulation = {
    init: function () {
        var $c = jQuery('.js-tabulation');
        $s = $c.find('.tab, .tab-time'),
			targets = [];

        //loop through tabs, cache the targets to show
        $s.each(function (i) {
            var $this = jQuery(this),
				rel = $this.attr('href'),
				t = $c.find(rel);

            if (i == 0) {
                $this.parent().addClass('selected');
                brail.tabulation.activeTab($this.parent());
            }

            if (t.length == 0)
                return false;

            targets.push(t);
        })

        //hide the content
        brail.tabulation.handler('hide');

        //click handler on the tabs
        $s.bind('click', function (e) {
            var $this = jQuery(this);

            e.preventDefault();

            $s.parent().removeClass('selected');
            jQuery(".activTab").remove();
            $this.parent().addClass('selected');
            brail.tabulation.activeTab($this.parent());


            brail.tabulation.handler('click', $this.attr('href'));
        });
    },
    handler: function (action, target) {
        var $t = '';

        if (target)
            target = target.substring(1);

        //hide content except first, store target object
        for (var i = 0, len = targets.length; i < len; ++i) {
            if (target && target == targets[i].attr('id'))
                $t = targets[i];

            if (action == 'hide' && i > 0 || action == 'click')
                targets[i].hide();
        }

        //show corresponding content tab
        if (action == 'click' && $t.length > 0) {
            if ($t.length > 0)
                $t.show();
        }
    },

    //for anysurfer
    activeTab: function (tabLink) {
        var $activeTabDictionaryKey = jQuery('#activeTabDictionaryKey').attr('value');
        tabLink.append('<span class="activTab">' + $activeTabDictionaryKey + '</span>')
    }
},

brail.watermark1 = {
    init: function () {
        jQuery('.js-watermark')
            .bind('focus', function (e) {
                var $this = jQuery(this),
                    d = $this.val();

                if ($this.hasClass('js-watermark')) {
                    this.defaultValue = d;

                    $this.removeClass('js-watermark');
                }

                if ($this.val() == this.defaultValue) {
                    $this.val('');
                }
            })
            .bind('blur', function (e) {
                var $this = jQuery(this);

                if (jQuery.trim($this.val()).length == 0) {
                    $this.val(this.defaultValue);
                }
            });
    }
},

brail.nolng = {
    init: function () {
        jQuery('.js-lang-notexist').find('a').bind('click', function (e) {

            e.preventDefault();

            var lng = this.rel;

            jQuery.ariaLightbox({
                html: jQuery('.js-msg-notexist-' + lng.toUpperCase()).html(),
                width: '400px',
                height: '250px'
            });
        });
    }
},

brail.tabs = {
    init: function () {
        //jQuery(".tab").tabs();
    }
},


brail.alphabeticalList = {
    init: function () {
        function goToByScroll(id) {
            jQuery('html,body').animate({ scrollTop: jQuery("#" + id).offset().top }, 'slow');
        }
    }
},

brail.sliderBar = {
    init: function (min, max, step, value) {

        brail.sliderBar.addSteps(step, min);

        jQuery(".js-slider-holder").slider({
            value: value,
            min: min,
            max: max,
            step: step,
            slide: function (event, ui) {
                jQuery("#radiusHiddenField").val(ui.value);
            }
        });

        jQuery("#radiusHiddenField").val(jQuery(".js-slider-holder").slider("value"));
    },
    addSteps: function (step, min) {
        var w = jQuery(".slider-amounts").width(),
			d = (w / (step - 1)) - 9;

        for (var i = 0; i < parseInt(step, 10); i++) {
            jQuery(".slider-amounts").append((function () {
                var e = jQuery('<li class="js-slider-amount"><a href="#">' + min * (i + 1) + 'km<a/></li>');

                e.css({
                    'margin-left': d * i
                });

                return e;
            })());
        }

        brail.sliderBar.eventOnKm();
    },
    eventOnKm: function () {
        function moveSlider(e, num) {
            e.preventDefault();
            jQuery(".js-slider-holder").slider(
                'value',
                [num]
            );
            jQuery("#radiusHiddenField").val(num);
        };

        jQuery(".js-slider-amount a").bind('click', function (e) {

            var kmValue = jQuery(this).text();
            //console.log(parseInt(kmValue));
            moveSlider(e, parseInt(kmValue));
        });
    }
},

brail.stationAccordion = {
    init: function () {
        jQuery(".station-criterias ul li .criteria-content").hide();
        jQuery(".js-stationInfos").each(function (i) {
            jQuery(this).bind('click', function () {
                var $this = jQuery(this);
                if ($this.hasClass('js-stationInfos')) {
                    $this.removeClass("js-stationInfos");
                    $this.parent().parent().parent().find(".criteria-content").slideDown(400, function () { jQuery(this).find('.mod-blue-small').css({ zoom: 1 }); });
                    $this.parent().addClass('active');
                } else {
                    $this.addClass("js-stationInfos");
                    $this.parent().parent().parent().find(".criteria-content").slideUp(400, function () { jQuery(this).find('.mod-blue-small').css({ zoom: '' }); });
                    $this.parent().removeClass('active');
                }
            });
        });

    }
},

brail.openingHours = {
    init: function () {
        jQuery(".js-openinghours").hide();
        jQuery(".js-openhours").each(function (i) {
            jQuery(this).bind('click', function () {
                var $this = jQuery(this);
                if ($this.hasClass('js-openhours')) {
                    $this.removeClass("js-openhours");
                    $this.parent().parent().parent().find(".js-openinghours").slideDown();
                    $this.parent().addClass('active');
                } else {
                    $this.addClass("js-openhours");
                    $this.parent().parent().parent().find(".js-openinghours").slideUp();
                    $this.parent().removeClass('active');
                }
            });
        });

    }
},


brail.stationTrajects = {
    init: function () {
        jQuery(".station-trajects ul li .traject-content").hide();
        jQuery('.js-traject-details > li:nth-child(even)').addClass('nth-child-even');

        jQuery(".js-trajects").each(function (i) {
            jQuery(this).bind('click', function () {
                var $this = jQuery(this);
                if ($this.hasClass('js-trajects')) {
                    $this.removeClass("js-trajects");
                    $this.parent().parent().parent().find(".traject-content").slideDown();
                    $this.parent().addClass('active');
                } else {
                    $this.addClass("js-trajects");
                    $this.parent().parent().parent().find(".traject-content").slideUp();
                    $this.parent().removeClass('active');
                }
            });
        });

    }
},


/* Watermark */


brail.watermark = function (inputName, defautlText) {
    jQuery(inputName).watermark(defautlText);
},

//keyhandler, submit when pressing enter
brail.keyhandler = function (inputID, buttonID, triggerButton) {
    jQuery(inputID).keyup(function (e) {
        if (e.keyCode == 13) {

            if (triggerButton) {
                jQuery(buttonID).trigger("click");
            }
            else {
                eval(jQuery(buttonID).attr('href'));
            }
        }
    });

    return false;
},

brail.inputSwitcher = {
    init: function () {
        jQuery('.js-pswitch').bind('click', function (e) {
            var rel = this.rel,
				items = rel.split(' '),
				e1 = e2 = '';

            if (items.length < 2)
                return false;

            e1 = jQuery('.' + items[0]);
            e2 = jQuery('.' + items[1]);

            if (e1.length == 0 || e2.length == 0)
                return false;

            var tempValue = e1.val();

            e1.val(e2.val());
            e2.val(tempValue);
        });
    }
},

/*
MOBILITY HOME
*/

brail.mobilityHome = {
    unChecked: function () {
        jQuery('.single input:radio').bind('click', function () {
            var $this = jQuery(this);
            jQuery('.single input:radio').removeAttr('checked');

            $this.prop('checked', true);
        });

        jQuery('.return input:radio').bind('click', function () {
            var $this = jQuery(this);
            jQuery('.return input:radio').removeAttr('checked');
            $this.prop('checked', true);
        });
    },
    switchLocations: function () {
        var tempDepartureId = document.getElementById("departureIdHidden").value;
        var tempArrivalId = document.getElementById("arrivalIdHidden").value;
        var tempDepartureLocationType = document.getElementById("departureLocationTypeHidden").value;
        var tempDepartureValue = document.getElementById("departureValueHidden").value;
        var tempArrivalLocationType = document.getElementById("arrivalLocationTypeHidden").value;
        var tempArrivalValue = document.getElementById("arrivalValueHidden").value;
        var tempDepartureInput = document.getElementById("departureStationInput").value;
        var tempArrivalInput = document.getElementById("arrivalStationInput").value;

        document.getElementById("departureIdHidden").value = tempArrivalId;
        document.getElementById("arrivalIdHidden").value = tempDepartureId;
        document.getElementById("departureLocationTypeHidden").value = tempArrivalLocationType;
        document.getElementById("departureValueHidden").value = tempArrivalValue;
        document.getElementById("arrivalLocationTypeHidden").value = tempDepartureLocationType;
        document.getElementById("arrivalValueHidden").value = tempDepartureValue;
        document.getElementById("departureStationInput").value = tempArrivalInput;
        document.getElementById("arrivalStationInput").value = tempDepartureInput;
    },
    hideRoundtrip: function () {
        ValidatorEnable(document.getElementById('returnDateRequiredValidator'), false);
        ValidatorEnable(document.getElementById('returnDateValidator'), false);
        ValidatorEnable(document.getElementById('returnHourRequiredValidator'), false);
        ValidatorEnable(document.getElementById('returnHourRangeValidator'), false);
        ValidatorEnable(document.getElementById('dateCompareValidator'), false);
        jQuery("#roundtrip").hide();

        jQuery(".ga-time-table").unbind('click.roundtriptimetable');
        jQuery(".ga-time-table").bind('click.singletimetable', function () {
            _gaq.push(['_trackEvent', 'Search - Timetable', 'Component', 'widget homepage']);
            _gaq.push(['_trackEvent', 'Search - Timetable', 'Station D - A', document.getElementById('departureStationInput').value + ' - ' + document.getElementById('arrivalStationInput').value]);

            _gaq.push(['_trackEvent', 'Search - Timetable', 'Type', 'single travel']);

            if (jQuery('.js-departure-radio').attr('checked') != undefined) {
                _gaq.push(['_trackEvent', 'Search - Timetable', 'Radio button', 'departure']);
            }

            if (jQuery('.js-arrival-radio').attr('checked') != undefined) {
                _gaq.push(['_trackEvent', 'Search - Timetable', 'Radio button', 'arrival']);
            }

            _gaq.push(['_trackEvent', 'Search - Timetable', 'Date D - A', document.getElementById('dateInput').value + ' - ']);
            _gaq.push(['_trackEvent', 'Search - Timetable', 'Hours D - A', document.getElementById('hoursInput').value + ' - ']);

        });
    },
    showRoundtrip: function () {
        ValidatorEnable(document.getElementById('returnDateRequiredValidator'), true);
        ValidatorEnable(document.getElementById('returnDateValidator'), true);
        ValidatorEnable(document.getElementById('returnHourRequiredValidator'), true);
        ValidatorEnable(document.getElementById('returnHourRangeValidator'), true);
        ValidatorEnable(document.getElementById('dateCompareValidator'), true);
        jQuery("#roundtrip").show();

        jQuery(".ga-time-table").unbind('click.singletimetable');
        jQuery(".ga-time-table").bind('click.roundtriptimetable', function () {

            _gaq.push(['_trackEvent', 'Search - Timetable', 'Component', 'widget homepage']);
            _gaq.push(['_trackEvent', 'Search - Timetable', 'Station D - A', document.getElementById('departureStationInput').value + ' - ' + document.getElementById('arrivalStationInput').value]);
            _gaq.push(['_trackEvent', 'Search - Timetable', 'Type', 'roundTrip travel']);

            if (jQuery('.js-departure-radio').attr('checked') != undefined) {
                _gaq.push(['_trackEvent', 'Search - Timetable', 'Radio button', 'departure']);
            }

            if (jQuery('.js-arrival-radio').attr('checked') != undefined) {
                _gaq.push(['_trackEvent', 'Search - Timetable', 'Radio button', 'arrival']);
            }

            if (jQuery('.js-departure-return-radio').attr('checked') != undefined) {
                _gaq.push(['_trackEvent', 'Search - Timetable', 'Radio button 2', 'departure']);
            }

            if (jQuery('.js-arrival-return-radio').attr('checked') != undefined) {
                _gaq.push(['_trackEvent', 'Search - Timetable', 'Radio button 2', 'arrival']);
            }

            _gaq.push(['_trackEvent', 'Search - Timetable', 'Date D - A', document.getElementById('dateInput').value + ' - ' + document.getElementById('date2Input').value]);
            _gaq.push(['_trackEvent', 'Search - Timetable', 'Hours D - A', document.getElementById('hoursInput').value + ' - ' + document.getElementById('hours2Input').value]);

        });
    },
    showRealtimeStation: function () {
        ValidatorEnable(document.getElementById('realtimeStationRequiredValidator'), true);
        ValidatorEnable(document.getElementById('departureStationRequiredValidator'), false);
        ValidatorEnable(document.getElementById('arrivalStationRequiredValidator'), false);
        jQuery("#stationInput").show();
        jQuery("#roadInput").hide();

        jQuery(".ga-realtime").unbind('click.roadrealtime');
        jQuery(".ga-realtime").bind('click.stationrealtime', function () {
            _gaq.push(['_trackEvent', 'Search - RealTime', 'Component', 'widget homepage']);
            _gaq.push(['_trackEvent', 'Search - RealTime', 'Station', document.getElementById('stationRealTimeInput').value]);
            _gaq.push(['_trackEvent', 'Search - RealTime', 'Type', 'Station']);

            if (jQuery('.js-departure-radio-realtime').attr('checked') != undefined) {
                _gaq.push(['_trackEvent', 'Search - Timetable', 'Radio button', 'departure']);
            }

            if (jQuery('.js-arrival-radio-realtime').attr('checked') != undefined) {
                _gaq.push(['_trackEvent', 'Search - Timetable', 'Radio button', 'arrival']);
            }

            _gaq.push(['_trackEvent', 'Search - RealTime', 'Date', document.getElementById('dateRealTimeInput').value]);
            _gaq.push(['_trackEvent', 'Search - RealTime', 'Hours', document.getElementById('hoursInput').value]);

        });
    },
    showRealtimeRoute: function () {
        ValidatorEnable(document.getElementById('realtimeStationRequiredValidator'), false);
        ValidatorEnable(document.getElementById('departureStationRequiredValidator'), true);
        ValidatorEnable(document.getElementById('arrivalStationRequiredValidator'), true);
        jQuery("#roadInput").show();
        jQuery("#stationInput").hide();

        jQuery(".ga-realtime").unbind('click.stationrealtime');
        jQuery(".ga-realtime").bind('click.roadrealtime', function () {
            _gaq.push(['_trackEvent', 'Search - RealTime', 'Component', 'widget homepage']);
            _gaq.push(['_trackEvent', 'Search - RealTime', 'From - To', document.getElementById('departureRealtimeStationInput').value + ' - ' + document.getElementById('arrivalRealtimeStationInput').value]);
            _gaq.push(['_trackEvent', 'Search - RealTime', 'Type', 'Road']);

            if (jQuery('.js-departure-radio-realtime').attr('checked') != undefined) {
                _gaq.push(['_trackEvent', 'Search - Timetable', 'Radio button', 'departure']);
            }

            if (jQuery('.js-arrival-radio-realtime').attr('checked') != undefined) {
                _gaq.push(['_trackEvent', 'Search - Timetable', 'Radio button', 'arrival']);
            }

            _gaq.push(['_trackEvent', 'Search - RealTime', 'Date', document.getElementById('dateRealTimeInput').value]);
            _gaq.push(['_trackEvent', 'Search - RealTime', 'Hours', document.getElementById('hoursInput').value]);

        });
    }
},

/*
HAFAS
*/

brail.hafas = {
    url: "",
    minChar: 1,
    stopDelay: 300,
    initMobilityHome: function () {
        if (typeof (HafasSuggestParamArray) == "undefined")
            HafasSuggestParamArray = new Array();

        //departure field routeplanner
        HafasSuggestParamArray.push({ loc: "departureStationInput",
            type: "S",
            minChar: this.minChar,
            cookiename: "SNCBsuggest-history",
            requestURL: this.url + "REQ0JourneyStopsS0A=7&S=",
            stopDelay: this.stopDelay,
            selectCallback: function (obj) {
                document.getElementById("departureLocationTypeHidden").value = obj.type;
                document.getElementById("departureValueHidden").value = obj.value;
                document.getElementById("departureIdHidden").value = obj.id;
            }
        })

        //arrival field routeplanner
        HafasSuggestParamArray.push({ loc: "arrivalStationInput",
            type: "Z",
            minChar: this.minChar,
            cookiename: "SNCBsuggest-history",
            requestURL: this.url + "REQ0JourneyStopsS0A=7&S=",
            stopDelay: this.stopDelay,
            selectCallback: function (obj) {
                document.getElementById("arrivalLocationTypeHidden").value = obj.type;
                document.getElementById("arrivalValueHidden").value = obj.value;
                document.getElementById("arrivalIdHidden").value = obj.id;
            }
        })

        //station field realtime
        HafasSuggestParamArray.push({ loc: "stationRealTimeInput",
            type: "S",
            minChar: this.minChar,
            cookiename: "SNCBsuggest-history",
            requestURL: this.url + "REQ0JourneyStopsS0A=1&S=",
            stopDelay: this.stopDelay,
            selectCallback: function (obj) {
                document.getElementById("stationRealtimeValueHidden").value = obj.value;
                document.getElementById("stationRealtimeIdHidden").value = obj.id;
            }
        })

        //departure field realtime
        HafasSuggestParamArray.push({ loc: "departureRealtimeStationInput",
            type: "S",
            minChar: this.minChar,
            cookiename: "SNCBsuggest-history",
            requestURL: this.url + "REQ0JourneyStopsS0A=1&S=",
            stopDelay: this.stopDelay,
            selectCallback: function (obj) {
                document.getElementById("departureRealtimeValueHidden").value = obj.value;
                document.getElementById("departureRealtimeIdHidden").value = obj.id;
            }
        })

        //arrival field realtime
        HafasSuggestParamArray.push({ loc: "arrivalRealtimeStationInput",
            type: "S",
            minChar: this.minChar,
            cookiename: "SNCBsuggest-history",
            requestURL: this.url + "REQ0JourneyStopsS0A=1&S=",
            stopDelay: this.stopDelay,
            selectCallback: function (obj) {
                document.getElementById("arrivalValueRealtimeHidden").value = obj.value;
                document.getElementById("arrivalRealtimeIdHidden").value = obj.id;
            }
        })
    },
    initRoutePlannerBox: function () {
        if (typeof (HafasSuggestParamArray) == "undefined")
            HafasSuggestParamArray = new Array();

        HafasSuggestParamArray.push({ loc: "departureInput",
            type: "S",
            minChar: this.minChar,
            cookiename: "SNCBsuggest-history",
            requestURL: this.url + "REQ0JourneyStopsS0A=7&S=",
            stopDelay: this.stopDelay,
            selectCallback: function (obj) {
                document.getElementById("departureLocationTypeHidden").value = obj.type;
                document.getElementById("departureValueHidden").value = obj.value;
                document.getElementById("departureIdHidden").value = obj.id;
            }
        })

        HafasSuggestParamArray.push({ loc: "arrivalInput",
            type: "Z",
            minChar: this.minChar,
            cookiename: "SNCBsuggest-history",
            requestURL: this.url + "REQ0JourneyStopsS0A=7&S=",
            stopDelay: this.stopDelay,
            selectCallback: function (obj) {
                document.getElementById("arrivalLocationTypeHidden").value = obj.type;
                document.getElementById("arrivalValueHidden").value = obj.value;
                document.getElementById("arrivalIdHidden").value = obj.id;
            }
        })
    },
    initStationSearch: function (callback) {
        if (typeof (HafasSuggestParamArray) == "undefined")
            HafasSuggestParamArray = new Array();

        HafasSuggestParamArray.push({ loc: "locationInput",
            type: "S",
            minChar: this.minChar,
            cookiename: "SNCBsuggest-history-stationsearch",
            requestURL: this.url + "REQ0JourneyStopsS0A=7&S=",
            stopDelay: this.stopDelay,
            selectCallback: function (obj) {
                document.getElementById("longitudeHidden").value = obj.xcoord;
                document.getElementById("latitudeHidden").value = obj.ycoord;
                document.getElementById("valueLocationHidden").value = obj.value;
                callback();

            }
        })
    },
    checkIfStationFromList: function () {
        var fromList = true;
        var lg = document.getElementById("longitudeHidden");
        var lat = document.getElementById("latitudeHidden");
        var loc = document.getElementById("valueLocationHidden");
        var inputValue = document.getElementById("locationInput");

        if (lg != "undefined" && lat != "undefined" && loc != "undefined") {
            if ((lg.value == '' && lat.value == '' && loc.value != '') || inputValue.value != loc.value) {
                fromList = false;
            }
        }

        return fromList;
    }
},

brail.quickInfo = {
    init: function () {
        if (jQuery('.pop-in-grid .inner .quickInfo').children('h2').length > 0) {
            jQuery(this).children('ul', 'p', 'span').css({ 'padding-top': '0' });
        }
        if (jQuery('.pop-in-grid .inner .quickInfo').children('h3').length > 0) {
            jQuery(this).children('ul', 'p', 'span').css({ 'padding-top': '0' });
        }
        else {
            jQuery('.pop-in-grid .inner .quickInfo').children().css({ 'padding-top': '15px' });
        }
    }
},

brail.hTicker = {
    init: function () {
        jQuery('.js-hticker').hTicker({
            intervalTime: 5000,
            animationSpeed: 1000,
            anysurferFriendly: true
        });
    }
},

/* cookies */

brail.cookies = {
    getCookie: function (name) {
        var result = null;
        var cookie = " " + document.cookie + ";";
        var searchName = " " + name + "=";
        var startOfCookie = cookie.indexOf(searchName);

        var endOfCookie;
        if (startOfCookie != -1) {
            startOfCookie += searchName.length;
            endOfCookie = cookie.indexOf(";", startOfCookie);
            result = unescape(cookie.substring(startOfCookie, endOfCookie));
        }
        return result;
    },
    setCookie: function (c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value + ";path=/";
    },
    //get multi value cookie value e.g. Person=name=amit&age=25;    
    getCookieMultiValue: function (cookiename, firstcookiekey, secondcookiekey) {
        var cookieMultiValues = new Array();
        var cookievalues = brail.cookies.getCookie(cookiename);
        if (cookievalues != null) {
            cookievaluesarray = cookievalues.split("&");
            for (c = 0; c < cookievaluesarray.length; c++) {
                cookienamevalue = cookievaluesarray[c].split("=");
                if (cookienamevalue.length > 1) //it has multi valued cookie
                {
                    if (cookienamevalue[0] == firstcookiekey) {
                        cookieMultiValues[c] = cookienamevalue[1].toString();
                    }

                    if (cookienamevalue[0] == secondcookiekey) {
                        cookieMultiValues[c] = cookienamevalue[1].toString();
                    }

                }
            }
            return cookieMultiValues;
        }
    }
},

/* shopping basket */

brail.shoppingBasket = {
    loadBasket: function () {
        var values = brail.cookies.getCookieMultiValue("dataShoppingBasket", "numberArticles", "totalPrices");
        if (values != undefined) {
            if (jQuery('.basket').find('.jq-shoppingbasketprice').length) {
                jQuery('.basket').find('.jq-shoppingbasketprice').html('&euro;' + values[1]);
            }
            if (jQuery('.basket').find('.jq-shoppingbasketarticles').length) {
                jQuery('.basket').find('.jq-shoppingbasketarticles').html(values[0]);
            }
        }

        if (values == undefined) {
            if (jQuery('.basket').find('.jq-shoppingbasketprice').length) {
                jQuery('.basket').find('.jq-shoppingbasketprice').html('&euro;' + '0,0');
            }
            if (jQuery('.basket').find('.jq-shoppingbasketarticles').length) {
                jQuery('.basket').find('.jq-shoppingbasketarticles').html('0');
            }
        }
    }
},

brail.excursionMap = {
    init: function () {
        if (jQuery('.b-excursion-header').children('.excursion-map')) {

            var mapHeight = jQuery('.b-excursion-header .excursion-map .bd').height();
            var bExcursionImgHeight = jQuery('.b-excursion-header .header-image img').height();

            jQuery('.b-excursion-header .header-image img').css({ 'height': bExcursionImgHeight + (mapHeight / 4) });

        }
    }
},

brail.webformsMark = {
    init: function () {
        if (jQuery('.webforms-marketeers').hasClass('js-webforms-contests')) {

        }
        else {
            jQuery('.webforms-marketeers').addClass('js-webforms-contests');
            brail.webformsMark.addMod();
            brail.webformsMark.otherMod();
            brail.webformsMark.inputSkin();
            brail.webformsMark.fixErrors();
            brail.webformsMark.btnSubmit();
        }
    },

    checkIfEmpty: function () {
        if (jQuery('.scfIntroBorder').children().length === 0) {
            jQuery('.intro-contest').hide();
        }
        if (jQuery('.scfFooterBorder').children().length === 0) {
            jQuery('.footer-contest').hide();
        }

    },

    addMod: function () {
        if (jQuery('.webforms-marketeers fieldset').hasClass('scfSectionBorderAsFieldSet')) {
            jQuery('.js-webforms-contests fieldset').each(function (i) {
                jQuery(this).wrap('<div class="pop-in-grid mod-blue-uni mod-contest-form"><div class="bd"></div></div>');
            });

            brail.webformsMark.appendTop();
        }
        else {
            jQuery('.scfSectionContent').addClass('js-simple-form');
            jQuery('.js-webforms-contests').addClass('js-simple-form-container');
            jQuery('.js-webforms-contests .js-simple-form').each(function (i) {
                jQuery(this).wrap('<div class="pop-in-grid mod-blue-uni mod-contest-form"><div class="bd"></div></div>');
            });

            brail.webformsMark.appendTop();
        }
    },

    appendTop: function () {
        if (jQuery('.js-webforms-contests .mod-blue-uni.mod-contest-form').children().hasClass('bd')) {
            jQuery('<div class="m-top"><div class="m-tl"></div><div class="m-tr"></div></div>').insertBefore('.js-webforms-contests .mod-blue-uni.mod-contest-form .bd'); ;
        }

        brail.webformsMark.appendBottom();
    },

    appendBottom: function () {
        jQuery('.js-webforms-contests .mod-blue-uni.mod-contest-form').each(function (i) {
            jQuery(this).append('<div class="m-bottom"><div class="m-bl"></div><div class="m-br"></div></div>');
        });

        brail.webformsMark.appendWhiteBg();
    },

    appendWhiteBg: function () {
        jQuery('.js-webforms-contests .mod-blue-uni.mod-contest-form .scfSectionContent').each(function (i) {
            jQuery(this).wrap('<div class="mod-white-uni"><div class="bd js-items-height"></div></div>');
        });

        brail.webformsMark.appendTopWhite();
    },

    appendTopWhite: function () {
        if (jQuery('.js-webforms-contests .mod-blue-uni.mod-contest-form .mod-white-uni').children().hasClass('bd')) {
            jQuery('<div class="m-top"><div class="m-tl"></div><div class="m-tr"></div></div>').insertBefore('.js-webforms-contests .mod-white-uni .bd'); ;
        }

        brail.webformsMark.appendBottomWhite();
    },

    appendBottomWhite: function () {
        jQuery('.js-webforms-contests .mod-blue-uni.mod-contest-form .mod-white-uni').each(function (i) {
            jQuery(this).append('<div class="m-bottom"><div class="m-bl"></div><div class="m-br"></div></div>');
        });
    },

    otherMod: function () {
        jQuery('.js-webforms-contests .scfIntroBorder').each(function (i) {
            jQuery(this).wrap('<div class="pop-in-grid mod-blue-uni intro-contest"><div class="bd"></div></div>');
            brail.webformsMark.introAppendTop();
        });

        jQuery('.js-webforms-contests .scfFooterBorder').each(function (i) {
            jQuery(this).wrap('<div class="pop-in-grid mod-blue-uni footer-contest"><div class="bd"></div></div>');
            brail.webformsMark.footerAppendTop();
        });

        brail.webformsMark.checkIfEmpty();
    },

    introAppendTop: function () {
        if (jQuery('.js-webforms-contests .mod-blue-uni.intro-contest').children().hasClass('bd')) {
            jQuery('<div class="m-top"><div class="m-tl"></div><div class="m-tr"></div></div>').insertBefore('.js-webforms-contests .mod-blue-uni.intro-contest .bd'); ;
        }

        brail.webformsMark.introAppendBottom();
    },

    introAppendBottom: function () {
        jQuery('.js-webforms-contests .mod-blue-uni.intro-contest').each(function (i) {
            jQuery(this).append('<div class="m-bottom"><div class="m-bl"></div><div class="m-br"></div></div>');
        });
    },

    footerAppendTop: function () {
        if (jQuery('.js-webforms-contests .mod-blue-uni.footer-contest').children().hasClass('bd')) {
            jQuery('<div class="m-top"><div class="m-tl"></div><div class="m-tr"></div></div>').insertBefore('.js-webforms-contests .mod-blue-uni.footer-contest .bd'); ;
        }

        brail.webformsMark.footerAppendBottom();
    },

    footerAppendBottom: function () {
        jQuery('.js-webforms-contests .mod-blue-uni.footer-contest').each(function (i) {
            jQuery(this).append('<div class="m-bottom"><div class="m-bl"></div><div class="m-br"></div></div>');
        });
    },

    inputSkin: function () {
        jQuery('.js-webforms-contests input:text , .js-webforms-contests input:password').each(function (i) {
            jQuery(this).wrap('<div class="textBox"></div>');
        });
    },

    fixErrors: function () {
        var errors = jQuery('.js-webforms-contests .scfValidator');
        jQuery('.js-webforms-contests input').blur(function () {
            errors.filter(':visible').css('display', 'block');

            // reset boxes height
            jQuery('.js-items-height').css('height', 'auto');
            brail.equalHeight.init();
        });
    },

    btnSubmit: function () {
        jQuery('.scfSubmitButtonBorder').addClass('btn-orange');
        jQuery('.scfSectionLegend').addClass('js-title-height');
        /*if (jQuery('.js-webforms-contests .scfEmailGeneralPanel, .js-webforms-contests .scfMultipleLineGeneralPanel, .js-webforms-contests .scfSingleLineGeneralPanel, .js-webforms-contests .scfPasswordGeneralPanel, .js-webforms-contests .scfNumberGeneralPanel, .js-webforms-contests .scfDateGeneralPanel, .js-webforms-contests .scfRadioButtonListGeneralPanel, .js-webforms-contests .scfCheckBoxListGeneralPanel, .js-webforms-contests .scfFileUploadGeneralPanel, .js-webforms-contests .scfDateSelectorGeneralPanel, .js-webforms-contests .scfCreditCardGeneralPanel, .js-webforms-contests .scfConfirmPasswordGeneralPanel, .js-webforms-contests .scfCaptchaGeneralPanel, .js-webforms-contests .scfTelephoneGeneralPanel, .js-webforms-contests .scfSmsTelephoneGeneralPanel').children().hasClass('scfRequired')) {
        jQuery(this).children('.scfRequired').detach().insertAfter('.textBox');
        }*/
    }
}

/*
DOM Ready
*/

jQuery(document).ready(function ($) {

    brail.wizardSteps.init();

    //init leftMenu
    brail.leftMenu.init();

    //shopping basket
    brail.shoppingBasket.loadBasket();

    //Webforms for marketeers contests
    brail.webformsMark.init();

    //items anything slider
    brail.slider.init();
    brail.slider.showContent();
    brail.slider.sliderTimeTable();

    jQuery(document).keydown(function (e) {
        var code = e.keyCode;
        if (code === 27) {
            parent.jQuery.fn.colorbox.close();
        }
    });

    jQuery(window).load(function () {
        //init menu
        brail.menu.init();

        //items equal height
        brail.equalHeight.simplifyTitle();
        brail.equalHeight.simplifyImage();
        brail.equalHeight.simplifyTxt();
        brail.equalHeight.simplifyForm();
        brail.equalHeight.simplifyList();
        //brail.equalHeight.simplifyCta();
        brail.equalHeight.simplifyBox();

        // Set Container height after items height
        brail.equalHeight.init();

        brail.mobilityHome.unChecked();

        brail.excursionMap.init();

    });

    //Background Image init
    brail.backgroundImage.init();

    //checkbox handler
    brail.form.checkbox.init();

    brail.datepickerInit.init();

    //accordion handler
    brail.accordion.init();

    //sitemap handler
    brail.sitemap.init();

    // bExcursionCatSummary
    brail.bExcursionCatSummary.init();

    brail.titleHeaderBg.init();

    brail.tabulation.init();

    brail.nolng.init();

    brail.tabs.init();

    brail.alphabeticalList.init();

    brail.inputSwitcher.init();

    // Station Infos
    brail.stationAccordion.init();

    brail.openingHours.init();

    brail.stationTrajects.init();

    brail.quickInfo.init();
    //brail.hTicker.init();

    (function () {
        jQuery('.js-emptyplaceholder').each(function () {
            var $this = $(this);

            jQuery.trim($this.html()).length == 0 ? $this.remove() : '';
        });
    })();
});

jQuery.fn.extend({
    hTicker: function (options) {
        var defaults = {
            intervalTime: 5000,
            animationSpeed: 1000,
            anysurferFriendly: true
        };

        var options = jQuery.extend(defaults, options);

        return this.each(function () {
            var self = jQuery(this).find('ul'),
				$tickers = self.find('li'),
				intervalId = false,
				active = false,
                $playPause = jQuery(this).find('.js-plpl'),
				pause = false;

            if ($playPause.length) {
                $playPause.bind('click', function () {
                    var $that = $(this);

                    if ($that.hasClass('play')) {
                        $that.removeClass('play');
                        pause = false;
                        intervalHandler();
                        init(false);
                    } else {
                        $that.addClass('play');
                        pause = true;
                        clearInterval(intervalId);

                        intervalId = false;
                    }
                });
            }

            var init = function (firstCall) {
                if (firstCall) {
                    if (options.anysurferFriendly)
                        anysurfer();

                    $tickers.filter(':not(:first)').css({ 'margin-top': '-30px' });
                    self.addClass('loaded');
                }

                if (!intervalId)
                    intervalId = setInterval(intervalHandler, options.intervalTime);
            }

            var intervalHandler = function () {
                var $t = $tickers.filter(':first');

                active = $t;

                $t.filter(':first').animate(
					{
					    'margin-top': '30px'
					},
					options.animationSpeed,
					cbHandler
				);

                $t.next().animate(
					{
					    'margin-top': '1px'
					},
					options.animationSpeed
				);
            }

            var cbHandler = function () {
                if (!active)
                    return false;

                active.css({ 'margin-top': '-30px' });
                self.append(active);

                $tickers = self.find('li');
            }

            var anysurfer = function () {
                self
					.bind('mouseover', function () {
					    if (pause) return false;
					    clearInterval(intervalId);

					    intervalId = false;
					})
					.bind('mouseout', function () {
					    if (pause) return false;
					    init(false);
					});

                self.find('a')
					.bind('focus', function () {
					    if (pause) return false;
					    clearInterval(intervalId);

					    intervalId = false;
					})
					.bind('blur', function () {
					    if (pause) return false;
					    init(false);
					})
            }

            //only init when more than 1 item
            if ($tickers.length > 1)
                init(true);
            else
                $playPause.hide();
        });
    }
});