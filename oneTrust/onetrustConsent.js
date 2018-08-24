var a, c;
"undefined" == typeof Optanon && (Optanon = OneTrust = {});
(function() {
    function L() {
        var b = [],
            e;
        for (e = 0; e < q.length; e += 1) Aa(q[e], ":1") && ia(q[e].replace(":1", "")) && b.push(q[e].replace(":1", ""));
        e = "," + b.toString().toLowerCase() + ",";
        window.OnetrustActiveGroups = e;
        window.OptanonActiveGroups = e;
        "undefined" != typeof dataLayer ? dataLayer.constructor === Array && (dataLayer.push({
            OnetrustActiveGroups: e
        }), dataLayer.push({
            OptanonActiveGroups: e
        })) : (window.dataLayer = [{
            event: "OptanonLoaded",
            OnetrustActiveGroups: e
        }], window.dataLayer = [{
            event: "OptanonLoaded",
            OptanonActiveGroups: e
        }]);
        setTimeout(function() {
            var e = new CustomEvent("consent.onetrust", {
                detail: b
            });
            window.dispatchEvent(e)
        })
    }

    function Ba() {
        var b = M("" + N + "/skins/default_flat_bottom_two_button_black/v2/css/optanon.css"),
            e = document.createElement("link");
        e.type = "text/css";
        e.href = b;
        e.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(e);
        b = (b = (b = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec("#003366")) ? {
                r: parseInt(b[1], 16),
                g: parseInt(b[2], 16),
                b: parseInt(b[3], 16)
            } : null) ? 186 < .299 * b.r + .587 * b.g + .114 * b.b ? "#000000" :
            "#ffffff" : "";
        e = document.createElement("style");
        e.innerHTML = "#optanon ul#optanon-menu li { background-color:  !important }#optanon ul#optanon-menu li.menu-item-selected { background-color:  !important }#optanon #optanon-popup-wrapper .optanon-white-button-middle { background-color: #003366 !important }.optanon-alert-box-wrapper .optanon-alert-box-button-middle { background-color: #003366 !important; border-color: #003366 !important; }#optanon #optanon-popup-wrapper .optanon-white-button-middle a { color: " +
            b + " !important }.optanon-alert-box-wrapper .optanon-alert-box-button-middle a { color: " + b + " !important }#optanon #optanon-popup-bottom { background-color: #CCCCCC !important }#optanon.modern #optanon-popup-top, #optanon.modern #optanon-popup-body-left-shading { background-color: #CCCCCC !important }.optanon-alert-box-wrapper { background-color:#555555 !important }.optanon-alert-box-wrapper .optanon-alert-box-bg p { color:#FFFFFF !important }";
        document.getElementsByTagName("head")[0].appendChild(e)
    }

    function Ca() {
        var b = v("OptanonConsent", "landingPath");
        if (b && b !== location.href) {
            var b = "true" === v("OptanonConsent", "AwaitingReconsent"),
                e = t(),
                h = F("OptanonAlertBoxClosed"),
                e = e.LastReconsentDate;
            h && e && new Date(e) > new Date(h) && !b ? (G(location.href), B("OptanonConsent", "AwaitingReconsent", !0)) : (G("NotLandingPage"), B("OptanonConsent", "AwaitingReconsent", !1), Da && Optanon.SetAlertBoxClosed(!0))
        } else G(location.href)
    }

    function G(b) {
        B("OptanonConsent", "landingPath", b)
    }

    function Ea(b) {
        var e = document.createElement("script"),
            h;
        null != b && "undefined" != typeof b && (h = !1, e.onload = e.onreadystatechange = function() {
            h || this.readyState && "loaded" != this.readyState && "complete" != this.readyState || (h = !0, b())
        });
        e.type = "text/javascript";
        e.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js";
        document.getElementsByTagName("head")[0].appendChild(e)
    }

    function Fa() {
        t();
        window.jQuery = f = jQuery.noConflict(!0);
        f(window).on("load", Optanon.LoadBanner);
        f(window).one("otloadbanner", function() {
            P();
            var b, e = t(),
                h, g, m;
            ja(e);
            f("body").prepend('\x3cdiv id\x3d"optanon" class\x3d"modern"\x3e\x3c/div\x3e');
            b = '\x3cdiv id\x3d"optanon-popup-bg"\x3e\x3c/div\x3e\x3cdiv id\x3d"optanon-popup-wrapper" role\x3d"dialog" aria-modal\x3d"true" tabindex\x3d"-1"\x3e\x3cdiv id\x3d"optanon-popup-top"\x3e';
            e.ShowPreferenceCenterCloseButton && (b = b + '\x3ca href\x3d"#" onClick\x3d"Optanon.TriggerGoogleAnalyticsEvent(\'OneTrust Cookie Consent\', \'Preferences Close Button\');" class\x3d"optanon-close-link optanon-close optanon-close-ui" title\x3d"Close Preference Centre"\x3e\x3cdiv id\x3d"optanon-close" style\x3d"background: url(' +
                M("" + N + "/skins/default_flat_bottom_two_button_black/v2/images/optanon-pop-up-close.png") + ');width:34px;height:34px;"\x3e\x3c/div\x3e\x3c/a\x3e');
            b = b + '\x3c/div\x3e\x3cdiv id\x3d"optanon-popup-body"\x3e\x3cdiv id\x3d"optanon-popup-body-left"\x3e\x3cdiv id\x3d"optanon-popup-body-left-shading"\x3e\x3c/div\x3e\x3cdiv id\x3d"optanon-branding-top-logo" style\x3d"background-image: url(' + M("" + N + "/logos/4427/4427_apply.uis.edu/UIS-Logo-Dome_UISblue.jpg") + ') !important;"\x3e\x3c/div\x3e\x3cul id\x3d"optanon-menu"\x3e\x3c/ul\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e';
            f("#optanon").html(b);
            e.Language && e.Language.Culture && f("#optanon-popup-wrapper").attr("lang", e.Language.Culture);
            for (m = 0; m < e.Groups.length; m += 1)
                if (b = e.Groups[m], w(b) == C || b && null == b.Parent && y(b)) {
                    h = w(b) == C;
                    g = -1 != f.inArray(u(b) + ":1", q);
                    h = f('\x3cli class\x3d"menu-item-necessary ' + (h || g ? "menu-item-on" : "menu-item-off") + '" title\x3d"' + w(b) + '"\x3e\x3cp\x3e\x3ca href\x3d"#"\x3e' + w(b) + "\x3c/a\x3e\x3c/p\x3e\x3c/li\x3e");
                    w(b) == C && h.removeClass("menu-item-necessary").addClass("menu-item-about");
                    switch (b.OptanonGroupId) {
                        case 2:
                            h.removeClass("menu-item-necessary").addClass("menu-item-performance");
                            break;
                        case 3:
                            h.removeClass("menu-item-necessary").addClass("menu-item-functional");
                            break;
                        case 4:
                            h.removeClass("menu-item-necessary").addClass("menu-item-advertising");
                            break;
                        case 8:
                            h.removeClass("menu-item-necessary").addClass("menu-item-social")
                    }
                    h.data("group", b);
                    h.data("optanonGroupId", u(b));
                    h.click(Ga);
                    f("#optanon #optanon-menu").append(h)
                }
            b = f('\x3cli class\x3d"menu-item-moreinfo menu-item-off" title\x3d"' + e.AboutText + '"\x3e\x3cp\x3e\x3ca target\x3d"_blank" href\x3d"' + e.AboutLink + "\" onClick\x3d\"Optanon.TriggerGoogleAnalyticsEvent('OneTrust Cookie Consent', 'Preferences Cookie Policy');\"\x3e" +
                e.AboutText + "\x3c/a\x3e\x3c/p\x3e\x3c/li\x3e");
            f("#optanon #optanon-menu").append(b);
            f("#optanon #optanon-popup-body").append('\x3cdiv id\x3d"optanon-popup-body-right"\x3e\x3ch2 aria-label\x3d"true"\x3e' + e.MainText + '\x3c/h2\x3e\x3cdiv class\x3d"vendor-header-container"\x3e\x3ch3\x3e\x3c/h3\x3e\x3cdiv id\x3d"optanon-popup-more-info-bar"\x3e\x3cdiv class\x3d"optanon-status"\x3e' + Ha(e, "chkMain") + ('\x3cdiv class\x3d"optanon-status-always-active optanon-status-on"\x3e\x3cp\x3e' + e.AlwaysActiveText + "\x3c/p\x3e\x3c/div\x3e") +
                '\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv id\x3d"optanon-main-info-text"\x3e\x3c/div\x3e' + (e.IsIABEnabled && e.VendorLevelOptOut ? '\x3cdiv id\x3d"optanon-vendor-consent-text"\x3eView Vendor Consent\x3c/div\x3e' : "") + '\x3c/div\x3e\x3cdiv class\x3d"optanon-bottom-spacer"\x3e\x3c/div\x3e');
            f("#optanon #optanon-popup-wrapper").append('\x3cdiv id\x3d"optanon-popup-bottom"\x3e \x3ca href\x3d"https://onetrust.com/poweredbyonetrust" target\x3d"_blank"\x3e\x3cdiv id\x3d"optanon-popup-bottom-logo" style\x3d"background: url(' +
                M("" + N + "/skins/default_flat_bottom_two_button_black/v2/images/cookie-collective-top-bottom.png") + ');width:155px;height:35px;" title\x3d"powered by OneTrust"\x3e\x3c/div\x3e\x3c/a\x3e\x3cdiv class\x3d"optanon-button-wrapper optanon-save-settings-button optanon-close optanon-close-consent"\x3e\x3cdiv class\x3d"optanon-white-button-left"\x3e\x3c/div\x3e\x3cdiv class\x3d"optanon-white-button-middle"\x3e\x3ca href\x3d"#" onClick\x3d"Optanon.TriggerGoogleAnalyticsEvent(\'OneTrust Cookie Consent\', \'Preferences Save Settings\');"\x3e' +
                e.AllowAllText + '\x3c/a\x3e\x3c/div\x3e\x3cdiv class\x3d"optanon-white-button-right"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"optanon-button-wrapper optanon-allow-all-button optanon-allow-all"\x3e\x3cdiv class\x3d"optanon-white-button-left"\x3e\x3c/div\x3e\x3cdiv class\x3d"optanon-white-button-middle"\x3e\x3ca href\x3d"#" onClick\x3d"Optanon.TriggerGoogleAnalyticsEvent(\'OneTrust Cookie Consent\', \'Preferences Allow All\');"\x3e' + e.ConfirmText + '\x3c/a\x3e\x3c/div\x3e\x3cdiv class\x3d"optanon-white-button-right"\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e');
            Y();
            Ia();
            e = t();
            b = '\x3cdiv class\x3d"optanon-alert-box-wrapper  " role\x3d"dialog" aria-modal\x3d"false" aria-labelledby\x3d"alert-box-title" aria-describedby\x3d"alert-notice-text" style\x3d"display:none"\x3e\x3cdiv class\x3d"optanon-alert-box-bottom-top"\x3e';
            e.showBannerCloseButton && (b += '\x3cdiv class\x3d"optanon-alert-box-corner-close"\x3e\x3ca class\x3d"optanon-alert-box-close" href\x3d"#" role\x3d"button" title\x3d"Close Banner" onClick\x3d"Optanon.TriggerGoogleAnalyticsEvent(\'OneTrust Cookie Consent\', \'Banner Close Button\');"\x3e\x3c/a\x3e\x3c/div\x3e');
            b += '\x3c/div\x3e\x3cdiv class\x3d"optanon-alert-box-bg"\x3e\x3cdiv class\x3d"optanon-alert-box-logo"\x3e \x3c/div\x3e\x3cdiv class\x3d"optanon-alert-box-body"\x3e';
            e.BannerTitle && (b = b + '\x3ch2 id\x3d"alert-box-title" class\x3d"optanon-alert-box-title"\x3e' + e.BannerTitle + "\x3c/h2\x3e");
            b = b + '\x3cp id\x3d"alert-notice-text"\x3e' + e.AlertNoticeText + '\x3c/p\x3e\x3c/div\x3e\x3cdiv class\x3d"optanon-clearfix"\x3e\x3c/div\x3e\x3cdiv class\x3d"optanon-alert-box-button-container"\x3e\x3cdiv class\x3d"optanon-alert-box-button optanon-button-close"\x3e\x3cdiv class\x3d"optanon-alert-box-button-middle"\x3e\x3ca role\x3d"button" class\x3d"optanon-alert-box-close" href\x3d"#"\x3e' + e.AlertCloseText + '\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"optanon-alert-box-button optanon-button-allow"\x3e\x3cdiv class\x3d"optanon-alert-box-button-middle"\x3e\x3ca id\x3d"alert-box-button-accept" role\x3d"button" class\x3d"optanon-allow-all" href\x3d"#" onClick\x3d"Optanon.TriggerGoogleAnalyticsEvent(\'OneTrust Cookie Consent\', \'Banner Accept Cookies\');"\x3e' +
                e.AlertAllowCookiesText + '\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"optanon-alert-box-button optanon-button-more"\x3e\x3cdiv class\x3d"optanon-alert-box-button-middle"\x3e\x3ca class\x3d"optanon-toggle-display" href\x3d"#" onClick\x3d"Optanon.TriggerGoogleAnalyticsEvent(\'OneTrust Cookie Consent\', \'Banner Open Preferences\');"\x3e' + e.AlertMoreInfoText + '\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"optanon-clearfix optanon-alert-box-bottom-padding"\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e';
            f("body").prepend(b);
            Ja();
            if (0 < f(".optanon-show-settings").length && (f(".optanon-show-settings").attr("href", "#"), f(".optanon-show-settings").wrap('\x3cdiv class\x3d"optanon-show-settings-popup-wrapper"\x3e').wrap('\x3cdiv class\x3d"optanon-show-settings-button"\x3e').wrap('\x3cdiv class\x3d"optanon-show-settings-middle"\x3e'), f(".optanon-show-settings-middle").before('\x3cdiv class\x3d"optanon-show-settings-left"\x3e\x3c/div\x3e'), f(".optanon-show-settings-middle").after('\x3cdiv class\x3d"optanon-show-settings-right"\x3e\x3c/div\x3e'),
                    f(".optanon-show-settings-button").addClass("optanon-toggle-display"), Ka(), e = t(), !("ontouchstart" in window || navigator.msMaxTouchPoints || v("OptanonConsent", "dnt") || v("OptanonConsent", "groups"))))
                for (b = 0; b < e.Groups.length; b += 1)
                    if (m = e.Groups[b], y(m) && (m = "do not track" == x(m).toLowerCase() && Q)) {
                        e = f(".optanon-show-settings-button").first();
                        ka(e);
                        f("#optanon-show-settings-popup").fadeIn(800);
                        la(e);
                        ma(e);
                        R = !0;
                        setTimeout(La, 4E3);
                        B("OptanonConsent", "dnt", "true");
                        break
                    }
            0 < f("#optanon-cookie-policy").length &&
                Ma();
            S();
            f('#alert-box-button-accept').focus();
            v("OptanonConsent", "groups") || D("OptanonConsent")
        });
        na && Optanon.LoadBanner()
    }

    function P() {
        f("script").filter(function() {
            return f(this).attr("type") && "text/plain" == f(this).attr("type").toLowerCase() && f(this).attr("class") && f(this).attr("class").toLowerCase().match(/optanon-category(-[0-9]+)+($|\s)/)
        }).each(function() {
            var b = f(this).attr("class").toLowerCase().split("optanon-category-")[1].split("-"),
                e = !0;
            if (b && 0 < b.length) {
                for (var h = 0; h < b.length; h++)
                    if (!T(b[h], !1)) {
                        e = !1;
                        break
                    }
                e && f(this).replaceWith(f(this).attr("type",
                    "text/javascript")[0].outerHTML)
            }
        })
    }

    function Ha(b, e) {
        return '\x3cdiv class\x3d"optanon-status-editable"\x3e\x3cform\x3e\x3cfieldset\x3e\x3cp\x3e\x3cinput type\x3d"checkbox" value\x3d"check" id\x3d"' + e + '" checked class\x3d"optanon-status-checkbox" /\x3e\x3clabel for\x3d"' + e + '"\x3e' + b.ActiveText + "\x3c/label\x3e\x3c/p\x3e\x3c/fieldset\x3e\x3c/form\x3e\x3c/div\x3e"
    }

    function Ga() {
        var b = t(),
            e = f(this).data("group");
        Z(e);
        ja(b);
        f("#optanon #optanon-menu li").removeClass("menu-item-selected");
        f(this).addClass("menu-item-selected");
        f("#optanon h3").text(w(e));
        f("#optanon #optanon-main-info-text").html(U(e));
        if (e && !b.HideToolbarCookieList) {
            var h = t(),
                g = f('\x3cdiv class\x3d"optanon-cookie-list"\x3e\x3c/div\x3e'),
                m, n = Z(e),
                p, z, A;
            (e.Cookies && 0 < e.Cookies.length || n && 0 < n.length) && g.append('\x3cdiv class\x3d"optanon-cookies-used"\x3e' + h.CookiesUsedText + "\x3c/div\x3e");
            if (e.Cookies && 0 < e.Cookies.length) {
                A = f('\x3cp class\x3d"optanon-group-cookies-list"\x3e\x3c/p\x3e');
                for (h = 0; h < e.Cookies.length; h += 1) p = e.Cookies[h], p = oa(p), A.append(p + (h <
                    e.Cookies.length - 1 ? ", " : ""));
                g.append(A)
            }
            if (n && 0 < n.length)
                for (h = 0; h < n.length; h += 1) {
                    A = f('\x3cp class\x3d"optanon-subgroup-cookies-list"\x3e\x3c/p\x3e');
                    m = pa(n[h]);
                    p = U(n[h]);
                    A.append('\x3cspan class\x3d"optanon-subgroup-header"\x3e' + m + ": \x3c/span\x3e");
                    var v = f('\x3cdiv class\x3d"optanon-subgroup-cookies"\x3e\x3c/div\x3e');
                    for (m = 0; m < n[h].Cookies.length; m += 1) z = n[h].Cookies[m], v.append(z.Name + (m < n[h].Cookies.length - 1 ? ", " : ""));
                    A.append(v);
                    p && A.append('\x3cdiv class\x3d"optanon-subgroup-description"\x3e' +
                        p + "\x3c/div\x3e");
                    g.append(A)
                }
            f("#optanon #optanon-main-info-text").append(g)
        }
        "always active" == x(e).toLowerCase() || "always active" == x(e.Parent).toLowerCase() ? (f("#optanon .optanon-status-always-active").show(), f("#optanon .optanon-status-editable").hide()) : (f("#optanon .optanon-status-editable").show(), f("#optanon .optanon-status-always-active").hide(), g = -1 != f.inArray(u(e) + ":1", q), n = f(e && null == e.Parent ? "#chkMain" : "#optanon #chk" + u(e)), g ? (n.prop("checked", !0), n.parent().addClass("optanon-status-on"),
            n.next("label").text(b.ActiveText)) : (n.prop("checked", !1), n.parent().removeClass("optanon-status-on"), b.InactiveText && n.next("label").text(b.InactiveText)));
        w(e) == C ? f("#optanon #optanon-popup-more-info-bar").hide() : f("#optanon #optanon-popup-more-info-bar").show();
        return !1
    }

    function Ia() {
        var b = t();
        f(document).on("click", ".optanon-close-consent", function() {
            Optanon.Close();
            qa(!0, !0);
            return !1
        });
        f(document).on("click", ".optanon-close-ui", function() {
            H();
            return !1
        });
        f(document).on("click", ".optanon-toggle-display",
            function() {
                Optanon.ToggleInfoDisplay();
                return !1
            });
        f(document).on("click", ".optanon-allow-all", function() {
            Optanon.AllowAll();
            qa(!0, !0);
            return !1
        });
        f(document).on("keydown", "#optanon", function(b) {
            27 == b.keyCode && H()
        });
        f("#optanon").on("change", ".optanon-status-checkbox", function() {
            var e = f(this).data("group") || f("#optanon #optanon-menu li.menu-item-selected").data("group");
            f(this).is(":checked") ? Na(b, e, this) : Oa(b, e, this);
            Y()
        })
    }

    function u(b) {
        return 0 == b.OptanonGroupId ? b.OptanonGroupId + "_" + b.GroupId : b.OptanonGroupId
    }

    function Na(b, e, h) {
        var g = w(e);
        Optanon.TriggerGoogleAnalyticsEvent("OneTrust Cookie Consent", "Preferences Toggle On", g);
        f("#optanon #optanon-menu li.menu-item-selected").removeClass("menu-item-off");
        f("#optanon #optanon-menu li.menu-item-selected").addClass("menu-item-on");
        f(h).parent().addClass("optanon-status-on");
        f("#optanon-show-settings-popup ul li").each(function() {
            f(h).text() == f("#optanon #optanon-menu li.menu-item-selected ").text() && f(h).find(".icon").removeClass("menu-item-off").addClass("menu-item-on")
        });
        g = V(q, u(e) + ":0"); - 1 != g && (q[g] = u(e) + ":1");
        f(h).next("label").text(b.ActiveText)
    }

    function Oa(b, e, h) {
        var g = w(e);
        Optanon.TriggerGoogleAnalyticsEvent("OneTrust Cookie Consent", "Preferences Toggle Off", g);
        f("#optanon #optanon-menu li.menu-item-selected ").removeClass("menu-item-on");
        f("#optanon #optanon-menu li.menu-item-selected").addClass("menu-item-off");
        f(h).parent().removeClass("optanon-status-on");
        f("#optanon-show-settings-popup ul li").each(function() {
            f(h).text() == f("#optanon #optanon-menu li.menu-item-selected ").text() &&
                f(h).find(".icon").removeClass("menu-item-on").addClass("menu-item-off")
        });
        g = V(q, u(e) + ":1"); - 1 != g && (q[g] = u(e) + ":0");
        b.InactiveText && f(h).next("label").text(b.InactiveText)
    }

    function ka(b) {
        var e = t(),
            h, g, m;
        b.parent(".optanon-show-settings-popup-wrapper").append('\x3cdiv id\x3d"optanon-show-settings-popup"\x3e\x3cdiv id\x3d"optanon-show-settings-popup-inner"\x3e\x3cdiv class\x3d"top-arrow"\x3e\x3c/div\x3e\x3cul\x3e\x3c/ul\x3e\x3cdiv class\x3d"menu-bottom-even"\x3e\x3c/div\x3e\x3cdiv class\x3d"bottom-arrow-even"\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e');
        for (m = 0; m < e.Groups.length; m += 1) {
            if ((b = e.Groups[m]) && null == b.Parent && y(b)) switch (h = -1 != f.inArray(u(b) + ":1", q), g = !F("OptanonConsent") && "do not track" == x(b).toLowerCase() && Q, h = f('\x3cli\x3e\x3cspan class\x3d"icon necessary-icon ' + (h ? "menu-item-on" : "menu-item-off") + '"\x3e\x3c/span\x3e' + w(b) + (g ? '\x3cbr\x3e\x3cspan class\x3d"optanon-dnt"\x3eOff by Do Not Track\x3c/span\x3e' : "") + '\x3cdiv class\x3d"menu-item-border"\x3e\x3c/div\x3e\x3c/li\x3e'), b.OptanonGroupId) {
                case 2:
                    h.find(".icon").removeClass("necessary-icon").addClass("performance-icon");
                    break;
                case 3:
                    h.find(".icon").removeClass("necessary-icon").addClass("functional-icon");
                    break;
                case 4:
                    h.find(".icon").removeClass("necessary-icon").addClass("advertising-icon");
                    break;
                case 8:
                    h.find(".icon").removeClass("necessary-icon").addClass("social-icon")
            }
            f("#optanon-show-settings-popup ul").append(h)
        }
        f("#optanon-show-settings-popup ul").children(":first").addClass("first");
        f("#optanon-show-settings-popup ul").children(":last").addClass("last");
        f("#optanon-show-settings-popup ul").children(":odd").addClass("even");
        f("#optanon-show-settings-popup ul").children(":even").addClass("odd");
        f("#optanon-show-settings-popup ul").children(":last").hasClass("odd") && (f("#optanon-show-settings-popup .bottom-arrow-even").removeClass("bottom-arrow-even").addClass("bottom-arrow-odd"), f("#optanon-show-settings-popup .menu-bottom-even").removeClass("menu-bottom-even").addClass("menu-bottom-odd"));
        f("#optanon-show-settings-popup ul li.last div").remove(".menu-item-border")
    }

    function aa() {
        f("#optanon-show-settings-popup").remove()
    }

    function La() {
        ra || f("#optanon-show-settings-popup").fadeOut(800, function() {
            aa()
        });
        R = !1
    }

    function Ka() {
        f(".optanon-show-settings-button").click(function() {
            Optanon.TriggerGoogleAnalyticsEvent("OneTrust Cookie Consent", "Privacy Settings Click")
        });
        "ontouchstart" in window || navigator.msMaxTouchPoints || f(".optanon-show-settings-button").hover(function() {
            Optanon.TriggerGoogleAnalyticsEvent("OneTrust Cookie Consent", "Privacy Settings Hover");
            ra = !0;
            R || (f("#optanon-show-settings-popup").stop(), aa(), ka(f(this)),
                f("#optanon-show-settings-popup").fadeIn(400), la(f(this)), ma(f(this)))
        }, function() {
            f("#optanon-show-settings-popup").fadeOut(400, function() {
                R = !1;
                aa()
            })
        })
    }

    function Ja() {
        if (!Optanon.IsAlertBoxClosedAndValid()) {
            var b = t();
            f(".optanon-alert-box-wrapper").show().animate({
                bottom: "0px"
            }, 1E3);
            b.ForceConsent && (Pa(b.AlertNoticeText) || f("#optanon-popup-bg").css({
                "z-index": "7000"
            }).show());
            f(".optanon-alert-box-close").click(function() {
                f(".optanon-alert-box-wrapper").fadeOut(200);
                f("#optanon-popup-bg").hide();
                1 == b.CloseShouldAcceptAllCookies && Optanon.AllowAll();
                Optanon.SetAlertBoxClosed(!0);
                return !1
            })
        }
    }

    function Ma() {
        var b, e, h, g, m, n, p = t(),
            z, q;
        for (h = 0; h < p.Groups.length; h += 1)
            if ((b = p.Groups[h]) && null == b.Parent && y(b)) {
                z = f('\x3cdiv class\x3d"optanon-cookie-policy-group"\x3e\x3c/div\x3e');
                z.append('\x3cp class\x3d"optanon-cookie-policy-group-name"\x3e' + w(b) + "\x3c/p\x3e");
                z.append('\x3cp class\x3d"optanon-cookie-policy-group-description"\x3e' + U(b) + "\x3c/p\x3e");
                if (0 < b.Cookies.length)
                    for (z.append('\x3cp class\x3d"optanon-cookie-policy-cookies-used"\x3e' +
                            p.CookiesUsedText + "\x3c/p\x3e"), z.append('\x3cul class\x3d"optanon-cookie-policy-group-cookies-list"\x3e\x3c/ul\x3e'), g = 0; g < b.Cookies.length; g += 1) e = b.Cookies[g], e = oa(e), z.find(".optanon-cookie-policy-group-cookies-list").append("\x3cli\x3e" + e + "\x3c/li\x3e");
                b = Z(b);
                if (0 < b.length) {
                    p.CookiesText || (p.CookiesText = "Cookies");
                    p.CategoriesText || (p.CategoriesText = "Categories");
                    p.LifespanText || (p.LifespanText = "Lifespan");
                    p.LifespanTypeText || (p.LifespanTypeText = "Session");
                    p.LifespanDurationText || (p.LifespanDurationText =
                        "days");
                    g = f('\x3cdiv class\x3d"optanon-cookie-policy-subgroup-table"\x3e\x3c/div\x3e');
                    g.append('\x3cdiv class\x3d"optanon-cookie-policy-subgroup-table-header clearfix"\x3e\x3c/div\x3e');
                    e = "";
                    p.IsLifespanEnabled && (e = "\x26nbsp;(" + p.LifespanText + ")");
                    g.find(".optanon-cookie-policy-subgroup-table-header").append('\x3cdiv class\x3d"optanon-cookie-policy-right"\x3e\x3cp class\x3d"optanon-cookie-policy-subgroup-table-column-header"\x3e' + p.CookiesText + e + "\x3c/p\x3e\x3c/div\x3e");
                    g.find(".optanon-cookie-policy-subgroup-table-header").append('\x3cdiv class\x3d"optanon-cookie-policy-left"\x3e\x3cp class\x3d"optanon-cookie-policy-subgroup-table-column-header"\x3e' +
                        p.CategoriesText + "\x3c/p\x3e\x3c/div\x3e");
                    for (e = 0; e < b.length; e += 1) {
                        q = f('\x3cdiv class\x3d"optanon-cookie-policy-subgroup"\x3e\x3c/div\x3e');
                        q.append('\x3cdiv class\x3d"optanon-cookie-policy-left"\x3e\x3c/div\x3e');
                        m = pa(b[e]);
                        q.find(".optanon-cookie-policy-left").append('\x3cp class\x3d"optanon-cookie-policy-subgroup-name"\x3e' + m + "\x3c/p\x3e");
                        q.find(".optanon-cookie-policy-left").append('\x3cp class\x3d"optanon-cookie-policy-subgroup-description"\x3e' + U(b[e]) + "\x3c/p\x3e");
                        q.append('\x3cdiv class\x3d"optanon-cookie-policy-right"\x3e\x3c/div\x3e');
                        q.find(".optanon-cookie-policy-right").append('\x3cul class\x3d"optanon-cookie-policy-subgroup-cookies-list"\x3e\x3c/ul\x3e');
                        if (p.IsLifespanEnabled)
                            for (m = 0; m < b[e].Cookies.length; m += 1) {
                                n = b[e].Cookies[m];
                                var u = "",
                                    u = n.IsSession ? p.LifespanTypeText : 0 === n.Length ? "\x3c 1 " + p.LifespanDurationText : n.Length + " " + p.LifespanDurationText;
                                q.find(".optanon-cookie-policy-subgroup-cookies-list").append("\x3cli\x3e" + n.Name + "\x26nbsp;(" + u + ")\x3c/li\x3e")
                            } else
                                for (m = 0; m < b[e].Cookies.length; m += 1) n = b[e].Cookies[m], q.find(".optanon-cookie-policy-subgroup-cookies-list").append("\x3cli\x3e" +
                                    n.Name + "\x3c/li\x3e");
                        g.append(q)
                    }
                    z.append(g)
                }
                f("#optanon-cookie-policy").append(z);
                sa()
            }
        f(window).resize(function() {
            sa()
        })
    }

    function U(b) {
        return b && b.GroupLanguagePropertiesSets && b.GroupLanguagePropertiesSets[0] && b.GroupLanguagePropertiesSets[0].GroupDescription && b.GroupLanguagePropertiesSets[0].GroupDescription.Text ? b.GroupLanguagePropertiesSets[0].GroupDescription.Text.replace(/\r\n/g, "\x3cbr\x3e") : ""
    }

    function w(b) {
        return b && b.GroupLanguagePropertiesSets && b.GroupLanguagePropertiesSets[0] && b.GroupLanguagePropertiesSets[0].GroupName ?
            b.GroupLanguagePropertiesSets[0].GroupName.Text : ""
    }

    function x(b) {
        var e = t();
        return b && b.GroupLanguagePropertiesSets && b.GroupLanguagePropertiesSets[0] && b.GroupLanguagePropertiesSets[0].DefaultStatus ? Q && e.IsDntEnabled && b.GroupLanguagePropertiesSets[0].IsDntEnabled ? "do not track" : b.GroupLanguagePropertiesSets[0].DefaultStatus.Text : ""
    }

    function pa(b) {
        if (!b) return "";
        var e = w(b);
        b = b.Cookies[0];
        return b ? e = '\x3ca href\x3d"http://cookiepedia.co.uk/host/' + b.Host + '" target\x3d"_blank" style\x3d"text-decoration: underline;"\x3e' +
            e + "\x3c/a\x3e" : e
    }

    function oa(b) {
        return b ? '\x3ca href\x3d"http://cookiepedia.co.uk/cookies/' + b.Name + '" target\x3d"_blank" style\x3d"text-decoration: underline;"\x3e' + b.Name + "\x3c/a\x3e" : ""
    }

    function sa() {
        f("#optanon-cookie-policy .optanon-cookie-policy-subgroup").each(function() {
            f(this).find(".optanon-cookie-policy-left").height("auto");
            f(this).find(".optanon-cookie-policy-right").height("auto");
            f(this).find(".optanon-cookie-policy-left").height() >= f(this).find(".optanon-cookie-policy-right").height() ?
                f(this).find(".optanon-cookie-policy-right").height(f(this).find(".optanon-cookie-policy-left").height()) : f(this).find(".optanon-cookie-policy-left").height(f(this).find(".optanon-cookie-policy-right").height())
        })
    }

    function Qa() {
        f("#optanon #optanon-menu li").removeClass("menu-item-selected");
        f("#optanon #optanon-menu li").each(function() {
            f(this).text() == C && f(this).click()
        });
        Y();
        var b = f("#optanon-popup-wrapper"),
            e = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            h =
            window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        b.css("margin-top", "10px");
        720 > e ? b.css("top", "10px") : b.outerHeight() > h ? b.css("top", Math.max(0, (h - b.outerHeight()) / 2 + f(window).scrollTop()) + "px") : b.css("top", Math.max(0, (h - b.outerHeight()) / 2) + "px");
        f("#optanon #optanon-popup-bg, #optanon #optanon-popup-wrapper").hide().fadeIn(400);
        b.focus()
    }

    function H(b) {
        f("#optanon #optanon-popup-bg, #optanon #optanon-popup-wrapper").fadeOut(400, b)
    }

    function ta(b) {
        if (x(b)) {
            var e =
                x(b).toLowerCase();
            b.Parent && (e = x(b.Parent).toLowerCase());
            return "always active" == e || "active" == e || "inactive landingpage" == e || "do not track" == e && !Q
        }
        return !0
    }

    function ua() {
        var b, e = t(),
            h;
        if (v("OptanonConsent", "groups")) {
            v("OptanonConsent", "groups") && !ba && (ba = !0);
            b = !1;
            var e = I(v("OptanonConsent", "groups")),
                g = I(v("OptanonConsent", "groups").replace(/:0/g, "").replace(/:1/g, ""));
            h = t();
            var f, n, p;
            if (v("OptanonConsent", "groups")) {
                for (n = 0; n < h.Groups.length; n += 1) f = h.Groups[n], y(f) && (p = V(g, u(f)), -1 == p && (b = !0, ta(f) ?
                    e.push(u(f) + ":1") : e.push(u(f) + ":0")));
                for (n = e.length - 1; 0 <= n; --n) {
                    p = !1;
                    for (g = 0; g < h.Groups.length; g += 1)
                        if (f = h.Groups[g], y(f) && u(f) == e[n].replace(/:0/g, "").replace(/:1/g, "")) {
                            p = !0;
                            break
                        }
                    p || (b = !0, e.splice(n, 1))
                }
                b && D("OptanonConsent", e)
            }
            q = I(v("OptanonConsent", "groups"))
        } else {
            q = [];
            for (h = 0; h < e.Groups.length; h += 1) b = e.Groups[h], y(b) && (ta(b) ? q.push(u(b) + ":1") : q.push(u(b) + ":0"));
            ba = !0
        }
    }

    function D(b, e) {
        e ? B(b, "groups", e.toString().toLowerCase()) : B(b, "groups", q.toString().toLowerCase())
    }

    function B(b, e, h) {
        var g = {},
            f = F(b),
            n, p;
        t();
        if (f)
            for (n = f.split("\x26"), f = 0; f < n.length; f += 1) p = n[f].split("\x3d"), g[decodeURIComponent(p[0])] = decodeURIComponent(p[1]).replace(/\+/g, " ");
        g[e] = h;
        g.datestamp = (new Date).toString();
        g.version = "3.6.23";
        e = "";
        for (var q in g) g.hasOwnProperty(q) && ("" != e && (e += "\x26"), e += q + "\x3d" + encodeURIComponent(g[q]).replace(/%20/g, "+"));
        da(b, e, 365)
    }

    function v(b, e) {
        var h = F(b),
            f, m, n;
        if (h) {
            f = {};
            m = h.split("\x26");
            for (h = 0; h < m.length; h += 1) n = m[h].split("\x3d"), f[decodeURIComponent(n[0])] = decodeURIComponent(n[1]).replace(/\+/g,
                " ");
            return e && f[e] ? f[e] : e && !f[e] ? "" : f
        }
        return ""
    }

    function da(b, e, h) {
        var f;
        h ? (f = new Date, f.setTime(f.getTime() + 864E5 * h), h = "; expires\x3d" + f.toGMTString()) : h = "";
        f = ["apply.uis.edu"];
        1 >= f.length && (f[1] = "");
        document.cookie = b + "\x3d" + e + h + "; path\x3d/" + f[1] + "; domain\x3d." + f[0]
    }

    function F(b) {
        b += "\x3d";
        var e = document.cookie.split(";"),
            f, g;
        for (f = 0; f < e.length; f += 1) {
            for (g = e[f];
                " " == g.charAt(0);) g = g.substring(1, g.length);
            if (0 == g.indexOf(b)) return g.substring(b.length, g.length)
        }
        return null
    }

    function T(b, e) {
        var f =
            null != b && "undefined" != typeof b,
            g, m;
        if (!e) {
            ua();
            g = E(q, b + ":1");
            a: {
                m = t();
                var n;
                for (n = 0; n < m.Groups.length; n += 1)
                    if (m.Groups[n].OptanonGroupId == b) {
                        m = !0;
                        break a
                    }
                m = !1
            }
            m = !m;
            return f && (g && ia(b) || m) ? !0 : !1
        }
        return !0
    }

    function ia(b) {
        var e = t(),
            f, g;
        for (g = 0; g < e.Groups.length; g += 1)
            if (e.Groups[g].OptanonGroupId == b) {
                f = e.Groups[g];
                break
            }
        return "inactive landingpage" != x(f).toLowerCase() ? !0 : (b = v("OptanonConsent", "landingPath")) && b !== location.href ? !0 : !1
    }

    function I(b) {
        return b ? b.toLowerCase().split(",") : []
    }

    function S() {
        var b;
        b = t();
        b.CustomJs && (new Function(b.CustomJs))();
        if ("function" == typeof OptanonWrapper && "undefined" != OptanonWrapper) {
            OptanonWrapper();
            for (b = 0; b < J.length; b += 1) E(ea, J[b]) || ea.push(J[b]);
            J = [];
            for (b = 0; b < K.length; b += 1) E(fa, K[b]) || fa.push(K[b]);
            K = []
        }
    }

    function ja(b) {
        b.Groups.unshift({
            GroupLanguagePropertiesSets: [{
                GroupName: {
                    Text: C
                },
                GroupDescription: {
                    Text: b.MainInfoText
                }
            }]
        })
    }

    function va(b) {
        if (b = document.getElementById(b))
            for (; b.hasChildNodes();) b.removeChild(b.lastChild)
    }

    function W(b) {
        if (b = document.getElementById(b)) b.style.display =
            "block"
    }

    function wa(b) {
        (b = document.getElementById(b)) && b.parentNode.removeChild(b)
    }

    function E(b, e) {
        var f;
        for (f = 0; f < b.length; f += 1)
            if (b[f].toString().toLowerCase() == e.toString().toLowerCase()) return !0;
        return !1
    }

    function V(b, e) {
        var f;
        for (f = 0; f < b.length; f += 1)
            if (b[f] == e) return f;
        return -1
    }

    function Aa(b, e) {
        return -1 != b.indexOf(e, b.length - e.length)
    }

    function Y() {
        var b = 0,
            e, h = t(),
            g;
        for (g = 0; g < h.Groups.length; g += 1)
            if (e = h.Groups[g], y(e) && E(q, u(e) + ":0") && (b += 1, 1 <= b)) return f("#optanon .optanon-allow-all-button").show(), !0;
        f("#optanon .optanon-allow-all-button").hide();
        return !1
    }

    function qa(b, e) {
        f(".optanon-alert-box-wrapper").fadeOut(400);
        b && (xa || !xa && !Optanon.IsAlertBoxClosedAndValid()) && Optanon.SetAlertBoxClosed(e)
    }

    function la(b) {
        f("#optanon-show-settings-popup").removeClass("optanon-show-settings-popup-top-button");
        f("#optanon-show-settings-popup ul").removeClass("top-button");
        f("#optanon-show-settings-popup .top-arrow, #optanon-show-settings-popup .bottom-arrow-even, #optanon-show-settings-popup .bottom-arrow-odd").hide();
        f("#optanon-show-settings-popup").css("top", "-" + f("#optanon-show-settings-popup-inner").height() + "px");
        var e = f("#optanon-show-settings-popup"),
            h = f(window).scrollTop(),
            e = e.offset().top;
        h >= e - 50 ? (f("#optanon-show-settings-popup").addClass("optanon-show-settings-popup-top-button"), f("#optanon-show-settings-popup ul").addClass("top-button"), f("#optanon-show-settings-popup").css("top", b.find(".optanon-show-settings-left").height() + f("#optanon-show-settings-popup .top-arrow").height() - 3 + "px"), f("#optanon-show-settings-popup .top-arrow").css("top",
            "-" + (f("#optanon-show-settings-popup .top-arrow").height() - 2) + "px"), f("#optanon-show-settings-popup .top-arrow").show()) : f("#optanon-show-settings-popup .bottom-arrow-even, #optanon-show-settings-popup .bottom-arrow-odd").show()
    }

    function ma(b) {
        var e = f("#optanon-show-settings-popup-inner");
        b = b.find(".optanon-show-settings-left").width() + b.find(".optanon-show-settings-middle").width() + b.find(".optanon-show-settings-right").width();
        var h = f("#optanon-show-settings-popup ul").width() - 3,
            g = f("#optanon-show-settings-popup .top-arrow").width(),
            m, n, p, q;
        e.css("margin-left", "-" + ((h - b) / 2 + b) + "px");
        f("#optanon-show-settings-popup .top-arrow, #optanon-show-settings-popup .bottom-arrow-even, #optanon-show-settings-popup .bottom-arrow-odd").css("margin-left", (h - g) / 2 + "px");
        e.css("left", "0px");
        m = f(window).scrollLeft();
        n = e.offset().left;
        p = m + f(window).width();
        q = n + e.width();
        b < h ? m >= n ? (e.css("margin-left", "-" + b + "px"), f("#optanon-show-settings-popup .top-arrow, #optanon-show-settings-popup .bottom-arrow-even, #optanon-show-settings-popup .bottom-arrow-odd").css("margin-left", (b - g) / 2 + "px")) : p <= q && (e.css("margin-left", "-" + h + "px"), f("#optanon-show-settings-popup .top-arrow, #optanon-show-settings-popup .bottom-arrow-even, #optanon-show-settings-popup .bottom-arrow-odd").css("margin-left", h - (b + g) / 2 + "px")) : p <= q ? e.css("margin-left", "-" + b + "px") : m >= n && e.css("margin-left", "-" + h + "px")
    }

    function y(b) {
        var e, f = t(),
            g = !1,
            m, n, p = f.IsIABEnabled ? !0 : null != b.Cookies && 0 < b.Cookies.length;
        if (b && null == b.Parent) {
            m = (b.Vendors && 0 < b.Vendors.length || b.Purposes && 0 < b.Purposes.length) && f.IsIABEnabled;
            for (n = 0; n < f.Groups.length; n += 1) {
                e = f.Groups[n];
                var q = f.IsIABEnabled ? !0 : null != e.Cookies && 0 < e.Cookies.length;
                if (null != e.Parent && w(b) && w(e.Parent) == w(b) && e.ShowInPopup && q) {
                    g = !0;
                    break
                }
            }
            return b.ShowInPopup && (p || g || m)
        }
        return b.ShowInPopup && p
    }

    function Z(b) {
        var e, f = t(),
            g = [],
            m;
        for (m = 0; m < f.Groups.length; m += 1) {
            e = f.Groups[m];
            var n = f.IsIABEnabled ? !0 : null != e.Cookies && 0 < e.Cookies.length;
            null != e.Parent && w(e.Parent) == w(b) && e.ShowInPopup && n && g.push(e)
        }
        return g
    }

    function t() {
        ha || (ha = {
            cctId: "3c49a08c-be7d-4992-8804-f49eacf394cd",
            euOnly: !1,
            MainText: "Cookie Preference Center",
            MainInfoText: "Cookies and related technologies (herein \u201cCookies\u201d) are small text files that a website saves on your computer when you visit the site. Cookies that the University sets are called first-party Cookies. The data collected might be about you, your device, your preferences, or your login information. This data is mostly used to make the website work as expected so that, for example, you don\u2019t have to keep re-entering your credentials whenever you come back to the site. Cookies that are set by third parties are called third-party Cookies.  We use third-party Cookies for analyzing website traffic and our advertising and marketing efforts. We have divided the Cookies we use into the following categories: Strictly Necessary, Performance, Functional, and Targeting. You can choose not to allow some of these types of Cookies when using this website by clicking on each different category heading and changing the default settings from Active to Inactive. However, Strictly Necessary Cookies will always be active, and blocking some types of Cookies may affect your experience on the site. Under each category heading on the left, you will find a list of the Cookies used that fall within that category.  By clicking on a listed Cookie, you can access Cookiepedia, an open knowledge Cookie database, which provides detailed information on each Cookie, including its purpose. To learn more about how any of the listed third parties use Cookies, consult their Cookie policy and terms of use. You can also change your browser settings to block, delete, or alert you to Cookies. However if you do that, you may have to manually adjust preferences every time you visit a site and some features may not work as intended.",
            AboutText: "More Information",
            AboutCookiesText: "What are Cookies?",
            ConfirmText: "Allow All",
            AllowAllText: "Save Settings",
            CookiesUsedText: "Cookies used",
            ShowAlertNotice: !0,
            AboutLink: "https://www.vpaa.uillinois.edu/resources/cookies",
            HideToolbarCookieList: !1,
            ActiveText: "Active",
            AlwaysActiveText: "Always Active",
            AlertNoticeText: "By continuing to browse or clicking \u201cAccept Cookies,\u201d you agree to the storing of first- and third-party cookies and related technologies on your device to enhance site access and navigation, analyze site usage, authenticate users, facilitate transactions, and assist in our marketing efforts.  Click on \u201cCookie Preference Center\u201d to set your preferences.\x3ca href\x3d'https://www.vpaa.uillinois.edu/resources/web_privacy'\x3eUniversity of Illinois Web Privacy Notice\x3c/a\x3e",
            AlertCloseText: "Close",
            AlertMoreInfoText: "Cookie Preferences",
            AlertAllowCookiesText: "Accept Cookies",
            CloseShouldAcceptAllCookies: !1,
            LastReconsentDate: 1529944083200,
            BannerTitle: "Cookie Notice",
            ForceConsent: !0,
            InactiveText: "Inactive",
            CookiesText: "Cookies",
            CategoriesText: "Categories",
            HasScriptArchive: !0,
            IsLifespanEnabled: !1,
            LifespanText: "Lifespan",
            IsIABEnabled: !1,
            VendorLevelOptOut: !0,
            Groups: [{
                ShowInPopup: !0,
                Order: 0,
                OptanonGroupId: 1,
                Parent: null,
                GroupLanguagePropertiesSets: [{
                    DefaultStatus: {
                        Text: "Always Active"
                    },
                    GroupDescription: {
                        Text: "Strictly Necessary Cookies are first-party Cookies that are necessary for the website to function. They can be either permanent or temporary and are usually only set in response to actions made directly by you that amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms. For example, we use Strictly Necessary Cookies to handle user registration and login. Some sites require the use of Cookies in order to access the site, such as University websites requiring University credentialed authentication. Without Strictly Necessary Cookies, services you have asked for cannot be provided. You can set your browser to delete, block, or alert you to these Cookies, but if you do so, you may not be able to access the site or some parts of the site will not work."
                    },
                    GroupName: {
                        Text: "Strictly Necessary Cookies"
                    },
                    IsDntEnabled: !1
                }],
                Cookies: [{
                    Name: "OptanonConsent",
                    Host: "apply.uis.edu",
                    IsSession: !1,
                    Length: 365
                }, {
                    Name: "OptanonAlertBoxClosed",
                    Host: "apply.uis.edu",
                    IsSession: !1,
                    Length: 365
                }],
                Purposes: [],
                GroupId: 134035
            }],
            ConsentModel: {
                Name: "Opt-in"
            },
            Language: {
                Culture: "en-GB"
            },
            showBannerCloseButton: !0,
            ShowPreferenceCenterCloseButton: !0,
            FooterDescriptionText: "\x3ca href\x3d'https://www.vpaa.uillinois.edu/resources/web_privacy'\x3eUniversity of Illinois Web Privacy Notice\x3c/a\x3e",
            IsDntEnabled: !1,
            CustomJs: null,
            LifespanTypeText: null,
            LifespanDurationText: null,
            IsConsentLoggingEnabled: !1
        });
        return ha
    }

    function Ra() {
        for (var b = t(), e = document.getElementsByTagName("script"), f = 0; f < e.length; ++f) {
            var g;
            g = e[f];
            var m = b.cctId;
            g = g.getAttribute("src") ? -1 !== g.getAttribute("src").indexOf(m) : !1;
            if (g) {
                X = ya(e[f].src);
                break
            }
        }
    }

    function M(b) {
        var e = ya(b);
        X && e && X.hostname !== e.hostname && (b = b.replace(e.hostname, X.hostname));
        return b
    }

    function ya(b) {
        var e = document.createElement("a");
        e.href = b;
        return e
    }

    function Pa(b) {
        var e = !1,
            h = za(window.location.href),
            g = f("\x3cdiv\x3e\x3c/div\x3e");
        g.html(b);
        b = f("a", g);
        for (g = 0; g < b.length; g++)
            if (za(b[g].href) == h) {
                e = !0;
                break
            }
        return e
    }

    function za(b) {
        return b.toLowerCase().replace(/(^\w+:|^)\/\//, "").replace("www.", "")
    }

    function Sa() {
        "function" != typeof Object.assign && Object.defineProperty(Object, "assign", {
            value: function(b, e) {
                if (null == b) throw new TypeError("Cannot convert undefined or null to object");
                for (var f = Object(b), g = 1; g < arguments.length; g++) {
                    var m = arguments[g];
                    if (null != m)
                        for (var n in m) Object.prototype.hasOwnProperty.call(m,
                            n) && (f[n] = m[n])
                }
                return f
            },
            writable: !0,
            configurable: !0
        })
    }

    function Ta() {
        Array.prototype.fill || Object.defineProperty(Array.prototype, "fill", {
            value: function(b, e, f) {
                if (null == this) throw new TypeError("this is null or not defined");
                var g = Object(this),
                    h = g.length >>> 0;
                e >>= 0;
                e = 0 > e ? Math.max(h + e, 0) : Math.min(e, h);
                f = void 0 === f ? h : f >> 0;
                for (h = 0 > f ? Math.max(h + f, 0) : Math.min(f, h); e < h;) g[e] = b, e++;
                return g
            }
        })
    }
    var N = document.currentScript.src.substring(0, document.currentScript.src.lastIndexOf("/")),
        Q = "yes" == navigator.doNotTrack ||
        "1" == navigator.doNotTrack || "1" == navigator.msDoNotTrack,
        R = !1,
        ra = !1,
        xa = function() {
            var b = !0,
                e, f = t(),
                g;
            for (g = 0; g < f.Groups.length; g += 1)
                if (e = f.Groups[g], y(e) && (!x(e) || x(e) && ("active" == x(e).toLowerCase() || "inactive landingpage" == x(e).toLowerCase() || "do not track" == x(e).toLowerCase()))) {
                    b = !1;
                    break
                }
            return b
        }(),
        Da = function() {
            var b = !0,
                e, f = t(),
                g;
            for (g = 0; g < f.Groups.length; g += 1)
                if (e = f.Groups[g], y(e) && (e = x(e).toLowerCase(), "inactive landingpage" !== e && "always active" !== e)) {
                    b = !1;
                    break
                }
            return b
        }(),
        ba = !1,
        q, ea = [],
        fa = [],
        J = [],
        K = [],
        C = t().AboutCookiesText,
        X = null,
        na = !1,
        ha, f;
    this.LoadBanner = function() {
        f ? f(window).trigger("otloadbanner") : na = !0
    };
    this.Init = function() {
        Sa();
        Ta();
        Ra();
        ua();
        (function() {
            function b(b, f) {
                f = f || {
                    bubbles: !1,
                    cancelable: !1,
                    detail: void 0
                };
                var e = document.createEvent("CustomEvent");
                e.initCustomEvent(b, f.bubbles, f.cancelable, f.detail);
                return e
            }
            if ("function" === typeof window.CustomEvent) return !1;
            b.prototype = window.Event.prototype;
            window.CustomEvent = b
        })();
        L();
        Ea(Fa);
        Ba();
        Ca()
    };
    this.InsertScript = function(b,
        e, f, g, m) {
        var h = null != g && "undefined" != typeof g,
            p;
        if (T(m, h && "undefined" != typeof g.ignoreGroupCheck && 1 == g.ignoreGroupCheck || !1) && !E(ea, m)) {
            J.push(m);
            h && "undefined" != typeof g.deleteSelectorContent && 1 == g.deleteSelectorContent && va(e);
            m = document.createElement("script");
            null != f && "undefined" != typeof f && (p = !1, m.onload = m.onreadystatechange = function() {
                p || this.readyState && "loaded" != this.readyState && "complete" != this.readyState || (p = !0, f())
            });
            m.type = "text/javascript";
            m.src = b;
            switch (e) {
                case "head":
                    document.getElementsByTagName("head")[0].appendChild(m);
                    break;
                case "body":
                    document.getElementsByTagName("body")[0].appendChild(m);
                    break;
                default:
                    document.getElementById(e) && (document.getElementById(e).appendChild(m), h && "undefined" != typeof g.makeSelectorVisible && 1 == g.makeSelectorVisible && W(e))
            }
            if (h && "undefined" != typeof g.makeElementsVisible)
                for (b = 0; b < g.makeElementsVisible.length; b += 1) W(g.makeElementsVisible[b]);
            if (h && "undefined" != typeof g.deleteElements)
                for (h = 0; h < g.deleteElements.length; h += 1) wa(g.deleteElements[h])
        }
    };
    this.InsertHtml = function(b, e, f, g, m) {
        var h =
            null != g && "undefined" != typeof g;
        if (T(m, h && "undefined" != typeof g.ignoreGroupCheck && 1 == g.ignoreGroupCheck || !1) && !E(fa, m)) {
            K.push(m);
            h && "undefined" != typeof g.deleteSelectorContent && 1 == g.deleteSelectorContent && va(e);
            m = document.getElementById(e);
            var p;
            m && (p = document.createElement("div"), p.innerHTML = b, m.appendChild(p));
            h && "undefined" != typeof g.makeSelectorVisible && 1 == g.makeSelectorVisible && W(e);
            if (h && "undefined" != typeof g.makeElementsVisible)
                for (b = 0; b < g.makeElementsVisible.length; b += 1) W(g.makeElementsVisible[b]);
            if (h && "undefined" != typeof g.deleteElements)
                for (h = 0; h < g.deleteElements.length; h += 1) wa(g.deleteElements[h]);
            null != f && "undefined" != typeof f && f()
        }
    };
    this.Close = function() {
        H();
        G("NotLandingPage");
        D("OptanonConsent");
        P();
        L();
        S()
    };
    this.AllowAll = function(b) {
        var e = t(),
            h;
        q = [];
        for (h = 0; h < e.Groups.length; h += 1) b = e.Groups[h], y(b) && q.push(u(b) + ":1");
        f("#optanon #optanon-menu li").removeClass("menu-item-off");
        f("#optanon #optanon-menu li").addClass("menu-item-on");
        f("#optanon-show-settings-popup ul li").each(function() {
            f(this).find(".icon").removeClass("menu-item-off").addClass("menu-item-on")
        });
        H();
        G("NotLandingPage");
        D("OptanonConsent");
        P();
        L();
        S()
    };
    this.ToggleInfoDisplay = function() {
        f("#optanon #optanon-popup-bg, #optanon #optanon-popup-wrapper").is(":hidden") ? Qa() : (H(), D("OptanonConsent"), P(), L(), S())
    };
    this.BlockGoogleAnalytics = function(b, e) {
        window["ga-disable-" + b] = !T(e)
    };
    this.TriggerGoogleAnalyticsEvent = function(b, e, f, g) {
        "undefined" != typeof _gaq && _gaq.push(["_trackEvent", b, e, f, g]);
        "undefined" != typeof ga && ga("send", "event", b, e, f, g);
        "undefined" != typeof dataLayer && dataLayer.constructor ===
            Array && dataLayer.push({
                event: "trackOptanonEvent",
                optanonCategory: b,
                optanonAction: e,
                optanonLabel: f,
                optanonValue: g
            })
    };
    this.IsAlertBoxClosed = this.IsAlertBoxClosedAndValid = function() {
        var b = t(),
            e = F("OptanonAlertBoxClosed"),
            b = b.LastReconsentDate;
        if (null === e) return !1;
        if (!b) return !0;
        (e = new Date(b) > new Date(e)) && Optanon.ReconsentGroups();
        return !e
    };
    this.ReconsentGroups = function() {
        var b = !1,
            e = I(v("OptanonConsent", "groups")),
            f = I(v("OptanonConsent", "groups").replace(/:0/g, "").replace(/:1/g, "")),
            g = t();
        if (v("OptanonConsent",
                "groups")) {
            for (var m = 0; m < g.Groups.length; m += 1) {
                var n = g.Groups[m];
                if (y(n)) {
                    var p = V(f, u(n));
                    if (-1 != p) {
                        var q = x(n).toLowerCase(); - 1 < ["inactive", "inactive landingpage", "do not track"].indexOf(q) && (b = !0, q = "inactive landingpage" === q ? ":1" : ":0", e[p] = u(n) + q)
                    }
                }
            }
            b && D("OptanonConsent", e)
        }
    };
    this.SetAlertBoxClosed = function(b) {
        var e = (new Date).toISOString();
        b ? da("OptanonAlertBoxClosed", e, 365) : da("OptanonAlertBoxClosed", e)
    };
    this.GetDomainData = function() {
        return t()
    };
    this.OnConsentChanged = function(b) {
        window.addEventListener("consent.onetrust",
            b)
    }
}).call(Optanon);
Optanon.Init();
