import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CredResult, TopicResult, NameResult, CredentialResult } from '../data-types';
import { TopicClient } from '../search/topic.client';
import { TopicCredClient } from '../search/topic-cred.client';
import { SearchResult, SearchResults } from '../search/results.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'subject-form',
  templateUrl: '../../themes/_active/subject/form.component.html',
  styleUrls: ['../../themes/_active/subject/form.component.scss']
})
export class SubjectFormComponent implements OnInit, OnDestroy {
  id: number;
  loaded: boolean;
  error: string;

  private _topic: SearchResult<TopicResult>;
  private _topicLoading: boolean;

  private _creds: SearchResults<CredentialResult>;
  private _credsLoading: boolean;

  private _idSub: Subscription;
  private _topicSub: Subscription;
  private _topicCredsSub: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _topicClient: TopicClient,
    private _topicCredClient: TopicCredClient) { }

  ngOnInit() {
    this._idSub = this._route.params.subscribe(params => {
      this.id = +params['topicId'];
      this._topicSub = this._topicClient.subscribe(this._receiveTopic.bind(this))
      this._topicClient.getRelatedById(this.id);

      this._topicCredsSub = this._topicCredClient.subscribe(this._receiveCreds.bind(this))
      this._topicCredClient.getRelatedById(this.id);
    });
  }

  get title(): string {
    if(this._topic && this._topic.data.names && this._topic.data.names.length) {
      return this._topic.data.names[0].text;
    }
  }

  get names(): NameResult[] {
    return this._topic && this._topic.data.names;
  }

  get topic(): TopicResult {
    return this._topic && this._topic.data;
  }

  get topicLoading(): boolean {
    return this._topicLoading;
  }

  get creds(): CredentialResult[] {
    return this._creds && this._creds.rows;
  }

  get credsLoading(): boolean {
    return this._credsLoading;
  }

  protected _receiveTopic(loading: boolean) {
    this._topicLoading = loading;
    // console.log(this.topic)
    this._topic = this._topicClient.result;
    this.loaded = true;
  }

  protected _receiveCreds(loading: boolean) {
    this._credsLoading = loading;
    this._creds = this._topicCredClient.results;
  }

  // protected _credsUpdate(loading: boolean) {
  //   this._credsLoading = loading;
  //   this._creds = this._credSearch.results;
  // }

  ngOnDestroy() {
    this._topicSub.unsubscribe();
    this._idSub.unsubscribe();
    this._topicCredsSub.unsubscribe();
  }
}
