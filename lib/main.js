"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const query = `
query($query: String!) {
  search(first: 100, query: $query, type: ISSUE) {
    nodes {
      ... on Issue {
        number
      }
    }
  }
}
`;
function closeIssues(octokit, numbers) {
    return __awaiter(this, void 0, void 0, function* () {
        const context = github.context;
        return numbers.map((number) => __awaiter(this, void 0, void 0, function* () {
            core.debug(`Close https://github.com/${formatNameWithOwner(context.repo)}/issues/${number}`);
            return octokit.issues.update(Object.assign({}, context.repo, { issue_number: number, state: 'closed' }));
        }));
    });
}
function formatNameWithOwner(repo) {
    return `${repo.owner}/${repo.name}`;
}
function getIssueNumbers(octokit, searchQuery) {
    return __awaiter(this, void 0, void 0, function* () {
        const context = github.context;
        const { data: data } = yield octokit.graphql(query, {
            query: `repo:${formatNameWithOwner(context.repo)} ${searchQuery}`
        });
        return data.search.nodes.map(issue => issue.number);
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = core.getInput('token');
            if (!token) {
                throw new Error('`token` is a required input parameter');
            }
            const searchQuery = core.getInput('query');
            if (!searchQuery) {
                throw new Error('`query` is a required input parameter');
            }
            const octokit = new github.GitHub(token);
            const issueNumbers = yield getIssueNumbers(octokit, searchQuery);
            yield closeIssues(octokit, issueNumbers);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
