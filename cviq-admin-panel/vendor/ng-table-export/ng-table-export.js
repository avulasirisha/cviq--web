angular.module("ngTableExport", []).config(["$compileProvider", function (n) {
    n.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data):/)
}]).directive("exportCsv", ["$parse", function (n) {
    return {
        restrict: "A", scope: !1, link: function (t, e, r) {
            var a = "", i = {
                stringify: function (n) {
                    return '"' + n.replace(/^\s\s*/, "").replace(/\s*\s$/, "").replace(/"/g, '""') + '"'
                }, generate: function () {
                    a = "";
                    var n = e.find("tr");
                    angular.forEach(n, function (n, t) {
                        var e = angular.element(n), r = e.find("th"), l = "";
                        e.hasClass("ng-table-filters") || (0 == r.length && (r = e.find("td")), 1 != t && (angular.forEach(r, function (n) {
                            l += i.stringify(angular.element(n).text()) + ";"
                        }), l = l.slice(0, l.length - 1)), a += l + "\n")
                    })
                }, link: function () {
                    return "data:text/csv;charset=UTF-8," + encodeURIComponent(a)
                }
            };
            n(r.exportCsv).assign(t.$parent, i)
        }
    }
}]);