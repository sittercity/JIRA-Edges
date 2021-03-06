describe("RapidBoard", function () {
  var container, rapidBoard;
  
  beforeEach(function () {
    container = document.createElement('section');
    container.innerHTML = [
      '<div id="gh">',
        '<div id="ghx-plan"></div>',
        '<div id="ghx-report"></div>',
        '<div id="ghx-work"></div>',
      '</div>'
    ].join('');

    rapidBoard = new JIRAEdges.RapidBoard(container);
  });

  describe("when the planning sprints and backlog are present", function () {
    it("sends an event");
  });

  describe("when sprints are visible", function () {
    it("sends an event");
    it("adds assignees' avatars to issues in visible sprints");
  });

  describe("when navigating away from the planning board", function () {
    it("sends an event");
    it("releases references to cached planning data");
  });

  describe("getSprintIssues", function () {
    it("caches issue data for a particular sprint", function () {
      var fieldsA = {}, fieldsB = {};
      var searchResult = {
        issues: [{ key: 'a', fields: fieldsA }, { key: 'b', fields: fieldsB }]
      };

      spyOn(JIRAEdges.JIRA, 'getSearchResults').and.callFake(function (query, onResult, onFinish) {
        expect(query.fields).toContain('assignee');
        expect(query.jql).toMatch(/sprint = 99/);

        onResult(searchResult);
      });

      rapidBoard.getSprintIssues(99);

      expect(JIRAEdges.JIRA.getSearchResults).toHaveBeenCalled();
      expect(rapidBoard.sprintIssues).toEqual({
        99: { a: fieldsA, b: fieldsB }
      });
    });

    it("sends an event when the data is cached", function () {
      spyOn(window, 'dispatchEvent');
      spyOn(JIRAEdges.JIRA, 'getSearchResults').and.callFake(function (query, onResult, onFinish) {
        onFinish();
      });

      rapidBoard.getSprintIssues(5);

      expect(window.dispatchEvent).toHaveBeenCalledWith(jasmine.objectContaining({
        type: 'jira-edges-planning-sprint-issues-changed',
        detail: 5
      }));
    });
  });

  describe("handlePlanningSprintIssuesChanged", function () {
    it("adds assignees' avatars to a sprint's issues");
  });

  describe("handlePlanningSprintVisible", function () {
    it("caches issue data for a sprint once");
  });

  describe("handlePlanningDone", function () {
    it("releases references to cached planning data");
  });

  describe("showIssueAssignee", function () {
    var assignee,
      existingAvatar,
      issue,
      issueGutter,
      renderedTemplate;

    beforeEach(function () {
      assignee = {
        displayName: 'John',
        avatarUrls: { '16x16': 'http://www.example.com/image.jpg' }
      };
      existingAvatar = null;
      issueGutter = {};
      renderedTemplate = {};

      chrome.i18n = { getMessage: function () {} };
      issue = { querySelector: function () {} };
      Mustache = { render: function () {} };

      spyOn(chrome.i18n, 'getMessage').and.returnValue('i18n Name');
      spyOn(issue, 'querySelector').and.callFake(function (selector) {
        if (selector === 'div.ghx-end') return issueGutter;
        if (selector === 'img.jira-edges-avatar') return existingAvatar;
      });
      spyOn(Mustache, 'render').and.returnValue(renderedTemplate);
    });

    afterEach(function () {
      expect(Mustache.render).toHaveBeenCalledWith(
        '<img class="jira-edges-avatar" src="{{url}}" alt="{{name}}" title="i18n Name" />',
        jasmine.objectContaining({
          name: 'John',
          url: 'http://www.example.com/image.jpg'
        })
      );
    });

    it("removes an existing assignee's avatar from an issue", function () {
      existingAvatar = {};
      spyOn(JIRAEdges.DOM, 'replace');
      rapidBoard.showIssueAssignee(issue, assignee);
      expect(JIRAEdges.DOM.replace).toHaveBeenCalledWith(existingAvatar, renderedTemplate);
    });

    it("adds an assignee's avatar to an issue", function () {
      spyOn(JIRAEdges.DOM, 'prepend');
      rapidBoard.showIssueAssignee(issue, assignee);
      expect(JIRAEdges.DOM.prepend).toHaveBeenCalledWith(issueGutter, renderedTemplate);
      ;
    });
  });
});
