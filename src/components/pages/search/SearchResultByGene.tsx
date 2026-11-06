import type { AssemblyVersionDetail, GeneHit } from "@/utils/services/genomics";
import ExternalGeneLink from "@/components/common/ExternalGeneLink";

type SearchResultByGeneProps = {
  genes: GeneHit[];
  assemblies?: AssemblyVersionDetail[];
  version?: string;
};

const SearchResultByGene: React.FC<SearchResultByGeneProps> = ({
  genes,
  assemblies = [],
  version,
}) => {
  const getAssemblyForSpecies = (species: string) =>
    assemblies.find((a) => a.speciesCode === species) ??
    assemblies.find((a) => a.speciesName === species || a.name === species);

  if (genes.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm min-h-[400px] flex items-center justify-center">
        <p className="text-slate-400 font-medium">No genes found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Gene
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Species
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Assembly
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {genes.map(({ species, gene }) => {
              const assembly = getAssemblyForSpecies(species);
              const infoUrl = assembly?.infoUrl || undefined;
              return (
                <tr
                  key={`${species}:${gene}`}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <ExternalGeneLink
                      gene={gene}
                      species={species}
                      assemblyInfoUrl={infoUrl}
                      version={version}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {assembly?.speciesName || species || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {assembly?.name || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Showing {genes.length} gene{genes.length !== 1 ? "s" : ""} based on
          gene search.
        </span>
      </div>
    </div>
  );
};

export default SearchResultByGene;
