import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  AssemblyVersionDetail,
  GeneSearchResult,
} from "@/utils/services/genomics";

import NothingFound from "./NothingFound";
import SearchResultByGene from "./SearchResultByGene";
import SearchResultByOrthology from "./SearchResultByOrthology";

type SearchResultProps = {
  term: string;
  searchData: GeneSearchResult;
  assemblies?: AssemblyVersionDetail[];
  version?: string;
};

const SearchResult: React.FC<SearchResultProps> = ({
  term,
  searchData,
  assemblies = [],
  version,
}) => {
  // /search is cross-species now: `genes` only comes back when a `species`
  // filter is sent, so the direct gene hits of an all-species search arrive in
  // `matchedGenes`, each with its species code. `otherGenes` is the narrower
  // list of matches that no orthology group contains and is not used here.
  const geneHits = searchData.matchedGenes ?? [];
  const orthologies = searchData.orthologies ?? [];

  const geneBadge = geneHits.length;
  const orthologyBadge = orthologies.length;

  if (geneBadge === 0 && orthologyBadge === 0) {
    return <NothingFound term={term} />;
  }

  const defaultTab = geneBadge > 0 ? "gene" : "orthology";

  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList>
        {geneBadge > 0 ? (
          <TabsTrigger value="gene" badge={geneBadge}>
            Search by Gene
          </TabsTrigger>
        ) : null}
        {orthologyBadge > 0 ? (
          <TabsTrigger value="orthology" badge={orthologyBadge}>
            Search by Orthology
          </TabsTrigger>
        ) : null}
      </TabsList>

      {geneBadge > 0 ? (
        <TabsContent value="gene">
          <SearchResultByGene
            genes={geneHits}
            assemblies={assemblies}
            version={version}
          />
        </TabsContent>
      ) : null}
      {orthologyBadge > 0 ? (
        <TabsContent value="orthology">
          <SearchResultByOrthology
            orthologies={orthologies}
            assemblies={assemblies}
            version={version}
          />
        </TabsContent>
      ) : null}
    </Tabs>
  );
};

export default SearchResult;
