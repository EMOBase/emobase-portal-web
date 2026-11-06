import type { Meta, StoryObj } from "@storybook/react-vite";

import SearchResult from "./SearchResult";
import type {
  GeneSearchResult,
  AssemblyVersionDetail,
} from "@/utils/services/genomics";

const meta: Meta<typeof SearchResult> = {
  title: "Search/SearchResult",
  component: SearchResult,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof SearchResult>;

const assemblies: AssemblyVersionDetail[] = [
  {
    id: 1,
    versionId: 1,
    name: "Tcas 5.2",
    speciesCode: "Tcas",
    speciesName: "Tribolium castaneum",
    infoUrl: "https://ibeetle-base.uni-goettingen.de/",
    createdAt: "2026-01-01T00:00:00Z",
    createdBy: "storybook",
    updatedAt: "2026-01-01T00:00:00Z",
    updatedBy: "storybook",
    status: "READY",
    files: {},
  } as AssemblyVersionDetail,
  {
    id: 2,
    versionId: 1,
    name: "Ptep 1.0",
    speciesCode: "Ptep",
    speciesName: "Parasteatoda tepidariorum",
    infoUrl: "https://ptep.emobase.uni-goettingen.de/",
    createdAt: "2026-01-01T00:00:00Z",
    createdBy: "storybook",
    updatedAt: "2026-01-01T00:00:00Z",
    updatedBy: "storybook",
    status: "READY",
    files: {},
  } as AssemblyVersionDetail,
  {
    id: 3,
    versionId: 1,
    name: "Lyst 1.0",
    speciesCode: "Lsta",
    speciesName: "Lymnaea stagnalis",
    infoUrl: "https://ibb-test.vm19002.virt.gwdg.de/",
    createdAt: "2026-01-01T00:00:00Z",
    createdBy: "storybook",
    updatedAt: "2026-01-01T00:00:00Z",
    updatedBy: "storybook",
    status: "READY",
    files: {},
  } as AssemblyVersionDetail,
  {
    id: 4,
    versionId: 1,
    name: "Dmel r6.59",
    speciesCode: "Dmel",
    speciesName: "Drosophila melanogaster",
    infoUrl: "https://dmel.emobase.uni-goettingen.de/",
    createdAt: "2026-01-01T00:00:00Z",
    createdBy: "storybook",
    updatedAt: "2026-01-01T00:00:00Z",
    updatedBy: "storybook",
    status: "READY",
    files: {},
  } as AssemblyVersionDetail,
];

export const OnlyGenes: Story = {
  args: {
    term: "TC006123",
    assemblies,
    searchData: {
      // An all-species search returns direct gene hits as `otherGenes`; the
      // flat `genes` list is only returned when a `species` filter is sent.
      otherGenes: [
        { species: "Tcas", gene: "TC006123" },
        { species: "Tcas", gene: "TC006456" },
        { species: "Dmel", gene: "FBgn0001234" },
      ],
    } as GeneSearchResult,
  },
};

export const OnlyOrthology: Story = {
  args: {
    term: "OG0001234",
    assemblies,
    searchData: {
      orthologies: [
        {
          group: "OG0001234",
          source: "eggnog6",
          orthologs: [
            {
              species: "Tcas",
              genes: [
                { gene: "TC006123", synonyms: ["LOC660123"] },
                { gene: "TC006456", synonyms: [] },
              ],
            },
            {
              species: "Ptep",
              genes: [{ gene: "Ptep_000123", synonyms: ["pt123"] }],
            },
            {
              species: "Lsta",
              genes: [{ gene: "Lyst_12345", synonyms: [] }],
            },
            {
              species: "Dmel",
              genes: [{ gene: "FBgn0001234", synonyms: ["CG1234"] }],
            },
          ],
        },
        {
          group: "OG0005678",
          source: "OrthoMCL",
          orthologs: [
            {
              species: "Tcas",
              genes: [{ gene: "TC007890", synonyms: ["LOC660789"] }],
            },
            {
              species: "Dmel",
              genes: [{ gene: "FBgn0023456", synonyms: ["CG2345"] }],
            },
          ],
        },
        {
          group: "OG0009012",
          source: "eggnog6",
          orthologs: [
            {
              species: "Ptep",
              genes: [{ gene: "Ptep_001234", synonyms: ["pt1234"] }],
            },
            {
              species: "Lsta",
              genes: [{ gene: "Lyst_54321", synonyms: ["Ls54321"] }],
            },
          ],
        },
      ],
    } as GeneSearchResult,
  },
};

export const BothResults: Story = {
  args: {
    term: "TC000001",
    assemblies,
    searchData: {
      // The search page merges the per-species direct hits into `otherGenes`
      // while keeping the cross-species `orthologies` from the first call.
      otherGenes: [{ species: "Tcas", gene: "TC000001" }],
      orthologies: [
        {
          group: "OG0007944",
          source: "OrthoFinder",
          orthologs: [
            {
              species: "Dmel",
              genes: [{ gene: "FBgn0036557", synonyms: [] }],
            },
            {
              species: "Tcas",
              genes: [
                { gene: "TC000001", synonyms: [] },
                { gene: "TC009507", synonyms: [] },
                { gene: "TC031174", synonyms: [] },
              ],
            },
          ],
        },
      ],
    } as GeneSearchResult,
  },
};

export const NoResults: Story = {
  args: {
    term: "UNKNOWN123",
    assemblies,
    searchData: {} as GeneSearchResult,
  },
};
