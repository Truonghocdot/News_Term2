/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/video/page",{

/***/ "(app-pages-browser)/./src/app/video/page.tsx":
/*!********************************!*\
  !*** ./src/app/video/page.tsx ***!
  \********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _util_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/util/api */ \"(app-pages-browser)/./src/util/api.ts\");\n/* harmony import */ var _component_VideoCard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/component/VideoCard */ \"(app-pages-browser)/./src/component/VideoCard.tsx\");\n/* harmony import */ var _component_VideoCard__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_component_VideoCard__WEBPACK_IMPORTED_MODULE_3__);\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\n\nconst UserVideoPage = ()=>{\n    _s();\n    const [videos, setVideos] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"UserVideoPage.useEffect\": ()=>{\n            const fetchVideos = {\n                \"UserVideoPage.useEffect.fetchVideos\": async ()=>{\n                    try {\n                        const res = await _util_api__WEBPACK_IMPORTED_MODULE_2__.APIPost.getDataField('/api/posts/list');\n                        const result = await res.data;\n                        const filtered = Array.isArray(result) ? result.filter({\n                            \"UserVideoPage.useEffect.fetchVideos\": (post)=>post.video\n                        }[\"UserVideoPage.useEffect.fetchVideos\"]) : [];\n                        setVideos(filtered);\n                    } catch (error) {\n                        console.error('Lỗi khi tải video:', error);\n                    } finally{\n                        setLoading(false);\n                    }\n                }\n            }[\"UserVideoPage.useEffect.fetchVideos\"];\n            fetchVideos();\n        }\n    }[\"UserVideoPage.useEffect\"], []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"p-6\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                className: \"text-2xl font-bold mb-4\",\n                children: \"Video của bạn\"\n            }, void 0, false, {\n                fileName: \"D:\\\\workspace\\\\News_Term2\\\\fe\\\\src\\\\app\\\\video\\\\page.tsx\",\n                lineNumber: 31,\n                columnNumber: 7\n            }, undefined),\n            loading ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                children: \"Đang tải video...\"\n            }, void 0, false, {\n                fileName: \"D:\\\\workspace\\\\News_Term2\\\\fe\\\\src\\\\app\\\\video\\\\page.tsx\",\n                lineNumber: 33,\n                columnNumber: 9\n            }, undefined) : videos.length === 0 ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                children: \"Kh\\xf4ng c\\xf3 video n\\xe0o.\"\n            }, void 0, false, {\n                fileName: \"D:\\\\workspace\\\\News_Term2\\\\fe\\\\src\\\\app\\\\video\\\\page.tsx\",\n                lineNumber: 35,\n                columnNumber: 9\n            }, undefined) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4\",\n                children: videos.map((video)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((_component_VideoCard__WEBPACK_IMPORTED_MODULE_3___default()), {\n                        title: video.title,\n                        thumbnail: video.thumbnail,\n                        videoUrl: video.video,\n                        onClick: ()=>{\n                            // Xử lý khi người dùng click vào video, ví dụ mở modal hoặc chuyển trang\n                            console.log('Clicked:', video.video);\n                        }\n                    }, video.id, false, {\n                        fileName: \"D:\\\\workspace\\\\News_Term2\\\\fe\\\\src\\\\app\\\\video\\\\page.tsx\",\n                        lineNumber: 39,\n                        columnNumber: 13\n                    }, undefined))\n            }, void 0, false, {\n                fileName: \"D:\\\\workspace\\\\News_Term2\\\\fe\\\\src\\\\app\\\\video\\\\page.tsx\",\n                lineNumber: 37,\n                columnNumber: 9\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"D:\\\\workspace\\\\News_Term2\\\\fe\\\\src\\\\app\\\\video\\\\page.tsx\",\n        lineNumber: 30,\n        columnNumber: 5\n    }, undefined);\n};\n_s(UserVideoPage, \"PSjXGNrNjip6pTLeZjdJtTN37Qw=\");\n_c = UserVideoPage;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UserVideoPage);\nvar _c;\n$RefreshReg$(_c, \"UserVideoPage\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9hcHAvdmlkZW8vcGFnZS50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQzRDO0FBQ1A7QUFFUztBQUU5QyxNQUFNSSxnQkFBZ0I7O0lBQ3BCLE1BQU0sQ0FBQ0MsUUFBUUMsVUFBVSxHQUFHTCwrQ0FBUUEsQ0FBUyxFQUFFO0lBQy9DLE1BQU0sQ0FBQ00sU0FBU0MsV0FBVyxHQUFHUCwrQ0FBUUEsQ0FBVTtJQUVoREQsZ0RBQVNBO21DQUFDO1lBQ1IsTUFBTVM7dURBQWM7b0JBQ2xCLElBQUk7d0JBQ0YsTUFBTUMsTUFBTSxNQUFNUiw4Q0FBT0EsQ0FBQ1MsWUFBWSxDQUFDO3dCQUN2QyxNQUFNQyxTQUFTLE1BQU1GLElBQUlHLElBQUk7d0JBQzdCLE1BQU1DLFdBQVdDLE1BQU1DLE9BQU8sQ0FBQ0osVUFDM0JBLE9BQU9LLE1BQU07bUVBQUMsQ0FBQ0MsT0FBZUEsS0FBS0MsS0FBSztvRUFDeEMsRUFBRTt3QkFDTmIsVUFBVVE7b0JBQ1osRUFBRSxPQUFPTSxPQUFPO3dCQUNkQyxRQUFRRCxLQUFLLENBQUMsc0JBQXNCQTtvQkFDdEMsU0FBVTt3QkFDUlosV0FBVztvQkFDYjtnQkFDRjs7WUFDQUM7UUFDRjtrQ0FBRyxFQUFFO0lBRUwscUJBQ0UsOERBQUNhO1FBQUlDLFdBQVU7OzBCQUNiLDhEQUFDQztnQkFBR0QsV0FBVTswQkFBMEI7Ozs7OztZQUN2Q2hCLHdCQUNDLDhEQUFDa0I7MEJBQUU7Ozs7OzRCQUNEcEIsT0FBT3FCLE1BQU0sS0FBSyxrQkFDcEIsOERBQUNEOzBCQUFFOzs7OzswQ0FFSCw4REFBQ0g7Z0JBQUlDLFdBQVU7MEJBQ1psQixPQUFPc0IsR0FBRyxDQUFDLENBQUNSLHNCQUNYLDhEQUFDaEIsNkRBQVNBO3dCQUVSeUIsT0FBT1QsTUFBTVMsS0FBSzt3QkFDbEJDLFdBQVdWLE1BQU1VLFNBQVM7d0JBQzFCQyxVQUFVWCxNQUFNQSxLQUFLO3dCQUNyQlksU0FBUzs0QkFDUCx5RUFBeUU7NEJBQ3pFVixRQUFRVyxHQUFHLENBQUMsWUFBWWIsTUFBTUEsS0FBSzt3QkFDckM7dUJBUEtBLE1BQU1jLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7QUFjM0I7R0EvQ003QjtLQUFBQTtBQWlETixpRUFBZUEsYUFBYUEsRUFBQyIsInNvdXJjZXMiOlsiRDpcXHdvcmtzcGFjZVxcTmV3c19UZXJtMlxcZmVcXHNyY1xcYXBwXFx2aWRlb1xccGFnZS50c3giXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBBUElQb3N0IH0gZnJvbSAnQC91dGlsL2FwaSc7XHJcbmltcG9ydCB7IFBvc3QgfSBmcm9tICdAL3V0aWwvdHlwZSc7XHJcbmltcG9ydCBWaWRlb0NhcmQgZnJvbSAnQC9jb21wb25lbnQvVmlkZW9DYXJkJztcclxuXHJcbmNvbnN0IFVzZXJWaWRlb1BhZ2UgPSAoKSA9PiB7XHJcbiAgY29uc3QgW3ZpZGVvcywgc2V0VmlkZW9zXSA9IHVzZVN0YXRlPFBvc3RbXT4oW10pO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlPGJvb2xlYW4+KHRydWUpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3QgZmV0Y2hWaWRlb3MgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgQVBJUG9zdC5nZXREYXRhRmllbGQoJy9hcGkvcG9zdHMvbGlzdCcpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlcy5kYXRhO1xyXG4gICAgICAgIGNvbnN0IGZpbHRlcmVkID0gQXJyYXkuaXNBcnJheShyZXN1bHQpXHJcbiAgICAgICAgICA/IHJlc3VsdC5maWx0ZXIoKHBvc3Q6IFBvc3QpID0+IHBvc3QudmlkZW8pXHJcbiAgICAgICAgICA6IFtdO1xyXG4gICAgICAgIHNldFZpZGVvcyhmaWx0ZXJlZCk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignTOG7l2kga2hpIHThuqNpIHZpZGVvOicsIGVycm9yKTtcclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIGZldGNoVmlkZW9zKCk7XHJcbiAgfSwgW10pO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJwLTZcIj5cclxuICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtYm9sZCBtYi00XCI+VmlkZW8gY+G7p2EgYuG6oW48L2gxPlxyXG4gICAgICB7bG9hZGluZyA/IChcclxuICAgICAgICA8cD7EkGFuZyB04bqjaSB2aWRlby4uLjwvcD5cclxuICAgICAgKSA6IHZpZGVvcy5sZW5ndGggPT09IDAgPyAoXHJcbiAgICAgICAgPHA+S2jDtG5nIGPDsyB2aWRlbyBuw6BvLjwvcD5cclxuICAgICAgKSA6IChcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgc206Z3JpZC1jb2xzLTIgbWQ6Z3JpZC1jb2xzLTMgbGc6Z3JpZC1jb2xzLTQgZ2FwLTRcIj5cclxuICAgICAgICAgIHt2aWRlb3MubWFwKCh2aWRlbykgPT4gKFxyXG4gICAgICAgICAgICA8VmlkZW9DYXJkXHJcbiAgICAgICAgICAgICAga2V5PXt2aWRlby5pZH1cclxuICAgICAgICAgICAgICB0aXRsZT17dmlkZW8udGl0bGV9XHJcbiAgICAgICAgICAgICAgdGh1bWJuYWlsPXt2aWRlby50aHVtYm5haWx9XHJcbiAgICAgICAgICAgICAgdmlkZW9Vcmw9e3ZpZGVvLnZpZGVvfVxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIFjhu60gbMO9IGtoaSBuZ8aw4budaSBkw7luZyBjbGljayB2w6BvIHZpZGVvLCB2w60gZOG7pSBt4bufIG1vZGFsIGhv4bq3YyBjaHV54buDbiB0cmFuZ1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NsaWNrZWQ6JywgdmlkZW8udmlkZW8pO1xyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICApKX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKX1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBVc2VyVmlkZW9QYWdlO1xyXG4iXSwibmFtZXMiOlsidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJBUElQb3N0IiwiVmlkZW9DYXJkIiwiVXNlclZpZGVvUGFnZSIsInZpZGVvcyIsInNldFZpZGVvcyIsImxvYWRpbmciLCJzZXRMb2FkaW5nIiwiZmV0Y2hWaWRlb3MiLCJyZXMiLCJnZXREYXRhRmllbGQiLCJyZXN1bHQiLCJkYXRhIiwiZmlsdGVyZWQiLCJBcnJheSIsImlzQXJyYXkiLCJmaWx0ZXIiLCJwb3N0IiwidmlkZW8iLCJlcnJvciIsImNvbnNvbGUiLCJkaXYiLCJjbGFzc05hbWUiLCJoMSIsInAiLCJsZW5ndGgiLCJtYXAiLCJ0aXRsZSIsInRodW1ibmFpbCIsInZpZGVvVXJsIiwib25DbGljayIsImxvZyIsImlkIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/app/video/page.tsx\n"));

/***/ }),

/***/ "(app-pages-browser)/./src/component/VideoCard.tsx":
/*!*************************************!*\
  !*** ./src/component/VideoCard.tsx ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



;
    // Wrapped in an IIFE to avoid polluting the global scope
    ;
    (function () {
        var _a, _b;
        // Legacy CSS implementations will `eval` browser code in a Node.js context
        // to extract CSS. For backwards compatibility, we need to check we're in a
        // browser context before continuing.
        if (typeof self !== 'undefined' &&
            // AMP / No-JS mode does not inject these helpers:
            '$RefreshHelpers$' in self) {
            // @ts-ignore __webpack_module__ is global
            var currentExports = module.exports;
            // @ts-ignore __webpack_module__ is global
            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;
            // This cannot happen in MainTemplate because the exports mismatch between
            // templating and execution.
            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
            // A module can be accepted automatically based on its exports, e.g. when
            // it is a Refresh Boundary.
            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
                // Save the previous exports signature on update so we can compare the boundary
                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)
                module.hot.dispose(function (data) {
                    data.prevSignature =
                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);
                });
                // Unconditionally accept an update to this module, we'll check if it's
                // still a Refresh Boundary later.
                // @ts-ignore importMeta is replaced in the loader
                module.hot.accept();
                // This field is set when the previous version of this module was a
                // Refresh Boundary, letting us know we need to check for invalidation or
                // enqueue an update.
                if (prevSignature !== null) {
                    // A boundary can become ineligible if its exports are incompatible
                    // with the previous exports.
                    //
                    // For example, if you add/remove/change exports, we'll want to
                    // re-execute the importing modules, and force those components to
                    // re-render. Similarly, if you convert a class component to a
                    // function, we want to invalidate the boundary.
                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {
                        module.hot.invalidate();
                    }
                    else {
                        self.$RefreshHelpers$.scheduleUpdate();
                    }
                }
            }
            else {
                // Since we just executed the code for the module, it's possible that the
                // new exports made it ineligible for being a boundary.
                // We only care about the case when we were _previously_ a boundary,
                // because we already accepted this update (accidental side effect).
                var isNoLongerABoundary = prevSignature !== null;
                if (isNoLongerABoundary) {
                    module.hot.invalidate();
                }
            }
        }
    })();


/***/ })

});