require 'rails_helper'

RSpec.describe PrecomputedDownloadRefreshWorker, type: :worker do
  Sidekiq::Testing.inline!

  describe :call do
    before(:each) do
      Api::V3::Readonly::DownloadFlow.refresh(sync: true)
      Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
      Api::V3::Readonly::DownloadAttribute.refresh(sync: true, skip_dependencies: true)
    end

    let(:context) { FactoryBot.create(:api_v3_context) }
    it 'symbolizes options keys' do
      expect(Api::V3::Download::FlowDownload).to receive(:new).
        with(context, pivot: true).and_call_original
      PrecomputedDownloadRefreshWorker.perform_async(context.id, pivot: true)
    end
  end
end
